from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from models.fitness_model import FitnessModel
from models.nutrition_model import NutritionModel

load_dotenv()


HOST = os.getenv("MODELS_HOST") or "127.0.0.1"
PORT = os.getenv("MODELS_PORT") or "3030"


fitness_model = FitnessModel.load()
nutrition_model = NutritionModel()
nutrition_model.load()
app = Flask("model-server")


@app.get("/")
def health():
    return "I'm alive!!"


@app.post("/fitness")
def fitness_predict():
    paramNames = [
        "home_or_gym",
        "level",
        "goal",
        "gender",
        "age",
        "feedback",
        "old_weight",
        "equipments",
    ]

    params = {}
    for paramName in paramNames:
        value = request.json.get(paramName)
        if value is None:
            return jsonify({"error": f"{paramName} is missing"}), 400
        params[paramName] = value

    return jsonify({"result": fitness_model.predict(**params)})


@app.post("/nutrition")
def nutrition_predict():
    paramNames = ["calories"]

    params = {}
    for paramName in paramNames:
        value = request.json.get(paramName)
        if value is None:
            return jsonify({"error": f"{paramName} is missing"}), 400
        params[paramName] = value
    return jsonify({"result": nutrition_model.generate_plan(**params)})


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
