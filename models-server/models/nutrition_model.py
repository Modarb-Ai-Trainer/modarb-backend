import random 
import pandas as pd
import numpy as np 
import pickle
import sys
import os
import pickle

SERVER_FILE_DIR = os.path.dirname(os.path.abspath(__file__))
NUTRITION_MODEL_PATH = os.path.join(
    SERVER_FILE_DIR, *"../resources/models/nutrition_model.pkl".split("/")
)


class NutritionModel:
    def generate_plan(self,calories):
        the_model = self.nutrition_model
        lunch_attr = {"Calories":calories*0.5, 
        "FatContent":random.uniform(19, 97), 
        "SaturatedFatContent":random.uniform(6, 12), 
        "CholesterolContent": random.uniform(77, 299), 
        "SodiumContent":random.uniform(565, 2299), 
        "CarbohydrateContent":random.uniform(28, 317), 
        "FiberContent": random.uniform(2, 38), 
        "SugarContent": random.uniform(0, 38),
        "ProteinContent":random.uniform(20, 123)}
        
        lunch_df = pd.DataFrame(lunch_attr, index=[0])
        
        breakfast_attr = {"Calories":calories*0.30, 
        "FatContent":random.uniform(8.7, 20), 
        "SaturatedFatContent":random.uniform(1.7, 3.7), 
        "CholesterolContent": random.uniform(0, 63), 
        "SodiumContent":random.uniform(163, 650), 
        "CarbohydrateContent":random.uniform(23, 56), 
        "FiberContent": random.uniform(2.6, 8), 
        "SugarContent": random.uniform(3.5, 13),
        "ProteinContent":random.uniform(6, 25)}
        
        breakfast_df = pd.DataFrame(breakfast_attr, index=[0])
        
        dinner_attr = {"Calories":calories*0.30, 
        "FatContent":random.uniform(15, 33), 
        "SaturatedFatContent":random.uniform(6, 8), 
        "CholesterolContent": random.uniform(22, 86), 
        "SodiumContent":random.uniform(265, 775), 
        "CarbohydrateContent":random.uniform(14, 44), 
        "FiberContent": random.uniform(101, 110), 
        "SugarContent": random.uniform(3, 13),
        "ProteinContent":random.uniform(11, 25)}
        
        dinner_df = pd.DataFrame(dinner_attr, index=[0])
        
        snack_attr = {"Calories":random.uniform(90, 190), 
        "FatContent":random.uniform(1.7, 10), 
        "SaturatedFatContent":random.uniform(0.7, 3), 
        "CholesterolContent": random.uniform(2, 16), 
        "SodiumContent":random.uniform(47, 200), 
        "CarbohydrateContent":random.uniform(10, 31), 
        "FiberContent": random.uniform(0.4, 2.5), 
        "SugarContent": random.uniform(5.7, 21),
        "ProteinContent":random.uniform(3, 20)}
        
        snack_df = pd.DataFrame(snack_attr, index=[0])
        
        drinks_attr = {"Calories":random.uniform(60, 125), 
        "FatContent":random.uniform(0.2, 0.6), 
        "SaturatedFatContent":random.uniform(0, 0.1), 
        "CholesterolContent": random.uniform(0, 0.1), 
        "SodiumContent":random.uniform(3.5, 51), 
        "CarbohydrateContent":random.uniform(14, 30), 
        "FiberContent": random.uniform(0.2, 3.6), 
        "SugarContent": random.uniform(109, 122),
        "ProteinContent":random.uniform(0.4, 6)}
        
        drink_df = pd.DataFrame(drinks_attr, index=[0])
        
        lunch = the_model.transform(lunch_df)
        breakfast = the_model.transform(breakfast_df)
        dinner = the_model.transform(dinner_df)
        snack = the_model.transform(snack_df)
        drink = the_model.transform(drink_df)

        meals = np.concatenate((breakfast, lunch, dinner, snack, drink), axis=0)
        meals = np.transpose(meals)
        
        return meals
    

    def load(self):

        with open(NUTRITION_MODEL_PATH, "rb") as f:
            self.nutrition_model = pickle.load(f)

