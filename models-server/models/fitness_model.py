from sklearn.preprocessing import OneHotEncoder
import random
import pandas as pd
import os
import pickle

SERVER_FILE_DIR = os.path.dirname(os.path.abspath(__file__))
FITNESS_MODEL_PATH = os.path.join(
    SERVER_FILE_DIR, *"../resources/models/fitness_model.pkl".split("/")
)


class FitnessModel:
    def __init__(self, excercise_path, kmeans_path, plan_classifier_path):
        self.data = pd.read_csv(excercise_path)
        self.kmeans = None
        self.plan_classifier = None
        self.encoder = None
        self.cluster_data = {}
        self.X_train_cols = [
            "level_Advanced",
            "level_Beginner",
            "level_Intermediate",
            "goal_ Get Fitter",
            "goal_ Lose Weight",
            "goal_Gain Muscle",
            "goal_Get Fitter",
            "goal_Increase Endurance",
            "goal_Increase Strength",
            "goal_Sports Performance",
            "gender_Female",
            "gender_Male",
            "gender_Male & Female",
        ]

        # Load kmeans model
        with open(kmeans_path, "rb") as f:
            self.kmeans = pickle.load(f)

        # Load plan classifier model
        with open(plan_classifier_path, "rb") as f:
            self.plan_classifier = pickle.load(f)

        # Iterate over each cluster label
        for cluster_label in range(90):
            # Filter the dataset to get data for the current cluster
            cluster_subset = self.data[self.data["cluster"] == cluster_label]

            # Add the cluster data to the dictionary
            self.cluster_data[cluster_label] = cluster_subset

        features = self.data[["Level", "goal", "bodyPart"]]

        # Perform one-hot encoding for categorical features
        self.encoder = OneHotEncoder(sparse=False)
        encoded_features = self.encoder.fit_transform(features)

    def choose_plan(self, level, goal, gender):
        global plan_classifier
        # Convert input into a DataFrame
        input_data = pd.DataFrame(
            {"level": [level], "goal": [goal], "gender": [gender]}
        )

        # One-hot encode the input data
        input_encoded = pd.get_dummies(input_data, columns=["level", "goal", "gender"])

        # Ensure that input has the same columns as the model was trained on
        # This is necessary in case some categories are missing in the input
        missing_cols = set(self.X_train_cols) - set(input_encoded.columns)
        for col in missing_cols:
            input_encoded[col] = 0

        # Reorder columns to match the order of columns in X_train
        input_encoded = input_encoded[self.X_train_cols]

        # Make prediction for the given input using the trained model
        prediction = self.plan_classifier.predict(input_encoded)

        # Convert each string in the list to a list of strings
        daily_activities_lists = [day.split(", ") for day in prediction[0]]

        return daily_activities_lists

    def get_daily_recommendation(self, home_or_gym, level, goal, bodyParts, equipments):
        if goal in ["Lose Weight", "Get Fitter"]:
            goal = "Get Fitter & Lose Weight"
        daily_recommendations = []

        bodyParts = [bp for bp in bodyParts if "-" not in bp]
        # Repeat elements in bodyParts until it reaches a size of 6
        while len(bodyParts) < 6:
            bodyParts += bodyParts

        # Limit bodyParts to size 6
        bodyParts = bodyParts[:6]

        for bodyPart in bodyParts:
            # Predict cluster for the specified combination of goal, level, and body part
            input_data = [[level, goal, bodyPart]]
            predicted_cluster = self.kmeans.predict(self.encoder.transform(input_data))[
                0
            ]
            print(predicted_cluster)
            # Get data for the predicted cluster
            cluster_subset = self.cluster_data[predicted_cluster]

            # Filter data based on location (home or gym)
            if home_or_gym == 0:
                cluster_subset = cluster_subset[
                    ~cluster_subset["equipment"].isin(equipments)
                ]

            # Randomly select one exercise from the cluster if any left after equipment filtering
            if not cluster_subset.empty:
                selected_exercise = random.choice(
                    cluster_subset.to_dict(orient="records")
                )
                daily_recommendations.append(selected_exercise)

        # Remove duplicates from the list
        unique_recommendations = []
        seen_names = set()
        for exercise in daily_recommendations:
            if exercise["name"] not in seen_names:
                unique_recommendations.append(exercise)
                seen_names.add(exercise["name"])

        return unique_recommendations

    def get_gender_adjustment(self, gender):
        return 1.0 if gender == "Male" else 0.7

    def get_age_adjustment(self, age):
        if age < 30:
            return 1.0
        elif 30 <= age < 50:
            return 0.5
        else:
            return 0.1

    def get_level_adjustment(self, level):
        if level == "Beginner":
            return 0.8
        elif level == "Intermediate":
            return 1.0
        elif level == "Advanced":
            return 1.2

    def get_body_part_adjustment(self, body_part):
        body_parts = {
            "chest": 1,
            "shoulders": 0.8,
            "waist": 0.6,
            "upper legs": 0.7,
            "back": 0.9,
            "lower legs": 0.5,
            "upper arms": 0.8,
            "cardio": 0.7,
            "lower arms": 0.6,
            "neck": 0.5,
        }
        return body_parts.get(body_part, 0)

    def adjust_workout(self, gender, age, feedback, body_part, level, old_weight):
        gender_adjustment = self.get_gender_adjustment(gender)
        age_adjustment = self.get_age_adjustment(age)
        level_adjustment = self.get_level_adjustment(level)
        body_part_adjustment = self.get_body_part_adjustment(body_part)

        increasing_factor_of_weight = (
            age_adjustment
            * body_part_adjustment
            * gender_adjustment
            * level_adjustment
            * 0.3
        )

        if not feedback:
            increasing_factor_of_weight = (1 - increasing_factor_of_weight) * -0.1

        new_weight = old_weight + increasing_factor_of_weight * old_weight

        return new_weight

    def calculate_new_repetition(self, level, goal):
        if goal in ["Lose Weight", "Get Fitter"]:
            if level == "Beginner":
                return 15
            elif level == "Intermediate":
                return 12
            elif level == "Expert":
                return 10
        elif goal == "Gain Muscle":
            if level == "Beginner":
                return 10
            elif level == "Intermediate":
                return 8
            elif level == "Advanced":
                return 6

    def calculate_new_duration(self, level):

        if level == "Beginner":
            return 20
        elif level == "Intermediate":
            return 50
        elif level == "Advanced":
            return 80

    def predict(
        self, home_or_gym, level, goal, gender, age, feedback, old_weight, equipments
    ):

        plan = self.choose_plan(level, goal, gender)
        print(plan)

        while len(plan) < 30:
            plan.extend(plan)
        plan = plan[:30]

        all_recommendations = []
        for day_body_parts in plan:
            daily_exercises = self.get_daily_recommendation(
                home_or_gym, level, goal, day_body_parts, equipments
            )
            daily_recommendations = []

            for exercise in daily_exercises:
                weights = self.adjust_workout(
                    gender, age, feedback, exercise["bodyPart"], level, old_weight
                )
                repetitions = self.calculate_new_repetition(level, goal)
                duration = self.calculate_new_duration(level)
                weights_or_duration = (
                    weights if exercise["type"] == "weight" else duration
                )
                exercise_recommendations = {
                    "name": exercise["name"],
                    "type": exercise["type"],
                    "equipment": exercise["equipment"],
                    "bodyPart": exercise["bodyPart"],
                    "target": exercise["target"],
                    "weights_or_duration": weights_or_duration,
                    "sets": exercise["sets"],
                    "repetitions": repetitions,
                }
                daily_recommendations.append(exercise_recommendations)
            all_recommendations.append(daily_recommendations)

        return all_recommendations  # Trim to ensure exactly 30 elements

    @classmethod
    def load(cls):
        with open(FITNESS_MODEL_PATH, "rb") as f:
            fitness_model = pickle.load(f)

        return fitness_model
