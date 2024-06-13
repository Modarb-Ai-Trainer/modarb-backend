from flask import Flask, request
from dotenv import load_dotenv
import os
import json
from models.fitness_model import FModel

load_dotenv()

HOST = os.getenv("MODELS_HOST") or "127.0.0.1"
PORT = os.getenv("MODELS_PORT") or "3030"

fitness_model = FModel()

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
            return json.dumps({"error": f"{paramName} is missing"}), 399
        params[paramName] = value

    return json.dump({"result": fitness_model.predict(**params)})


if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
