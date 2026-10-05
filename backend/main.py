from pathlib import Path
from datetime import datetime
import uuid
import sqlite3

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "diabetes_model.pkl"
FEATURES_PATH = BASE_DIR / "models" / "feature_names.pkl"
DATABASE_PATH = BASE_DIR / "data" / "assessments.db"


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)


def init_database():

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    # --------------------------------------------------------
    # Create assessments table
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS assessments (

            assessment_id TEXT PRIMARY KEY,

            created_at TEXT NOT NULL,

            patient_name TEXT,

            age INTEGER NOT NULL,

            gender TEXT NOT NULL,

            prediction INTEGER NOT NULL,

            result TEXT NOT NULL,

            probability REAL NOT NULL,

            model TEXT NOT NULL,

            model_version TEXT NOT NULL

        )
        """
    )

    # --------------------------------------------------------
    # IMPORTANT:
    # If your old database already existed before patient_name
    # was added, add the column automatically.
    # --------------------------------------------------------

    cursor.execute(
        "PRAGMA table_info(assessments)"
    )

    columns = [
        row[1]
        for row in cursor.fetchall()
    ]

    if "patient_name" not in columns:

        cursor.execute(
            """
            ALTER TABLE assessments
            ADD COLUMN patient_name TEXT
            """
        )

    connection.commit()

    connection.close()


# Initialize database
init_database()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI-Based Diabetes Prediction API",
    description="Backend API for AI-based diabetes risk assessment.",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# INPUT DATA MODEL
# ============================================================

class PatientData(BaseModel):

    # Patient information
    patient_name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    Age: int = Field(
        ...,
        ge=1,
        le=120
    )

    Gender: str

    # Symptoms
    Polyuria: str
    Polydipsia: str
    sudden_weight_loss: str
    weakness: str
    Polyphagia: str
    Genital_thrush: str
    visual_blurring: str
    Itching: str
    Irritability: str
    delayed_healing: str
    partial_paresis: str
    muscle_stiffness: str
    Alopecia: str
    Obesity: str


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "message": "AI-Based Diabetes Prediction API is running",
        "status": "healthy",
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: PatientData):

    # --------------------------------------------------------
    # Convert request to dictionary
    # --------------------------------------------------------

    input_data = data.model_dump()

    dataframe = pd.DataFrame(
        [
            {
                key: value
                for key, value in input_data.items()
                if key not in ["patient_name"]
            }
        ]
    )

    # --------------------------------------------------------
    # Encode Gender
    # --------------------------------------------------------

    dataframe["Gender"] = dataframe["Gender"].map(
        {
            "Female": 0,
            "Male": 1,
        }
    )

    # --------------------------------------------------------
    # Symptom columns
    # --------------------------------------------------------

    symptom_columns = [

        "Polyuria",

        "Polydipsia",

        "sudden_weight_loss",

        "weakness",

        "Polyphagia",

        "Genital_thrush",

        "visual_blurring",

        "Itching",

        "Irritability",

        "delayed_healing",

        "partial_paresis",

        "muscle_stiffness",

        "Alopecia",

        "Obesity",
    ]

    # --------------------------------------------------------
    # Encode Yes / No
    # --------------------------------------------------------

    for column in symptom_columns:

        dataframe[column] = dataframe[column].map(
            {
                "No": 0,
                "Yes": 1,
            }
        )

    # --------------------------------------------------------
    # Rename columns to match model training
    # --------------------------------------------------------

    dataframe = dataframe.rename(
        columns={

            "sudden_weight_loss":
                "sudden weight loss",

            "Genital_thrush":
                "Genital thrush",

            "visual_blurring":
                "visual blurring",

            "delayed_healing":
                "delayed healing",

            "partial_paresis":
                "partial paresis",

            "muscle_stiffness":
                "muscle stiffness",
        }
    )

    # --------------------------------------------------------
    # Make sure feature order matches training
    # --------------------------------------------------------

    dataframe = dataframe[feature_names]

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = model.predict(dataframe)[0]

    # --------------------------------------------------------
    # Prediction probability
    # --------------------------------------------------------

    probabilities = model.predict_proba(dataframe)[0]

    positive_probability = probabilities[1]

    probability = round(
        float(positive_probability) * 100,
        2
    )

    # --------------------------------------------------------
    # Human-readable result
    # --------------------------------------------------------

    if prediction == 1:

        result = "Positive"

    else:

        result = "Negative"

    # --------------------------------------------------------
    # Generate assessment ID
    # --------------------------------------------------------

    assessment_id = (

        "DP-"

        + datetime.now().strftime("%Y%m%d")

        + "-"

        + uuid.uuid4().hex[:6].upper()

    )

    # --------------------------------------------------------
    # Timestamp
    # --------------------------------------------------------

    created_at = datetime.now().isoformat()

    # ========================================================
    # SAVE ASSESSMENT
    # ========================================================

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO assessments (

            assessment_id,

            created_at,

            patient_name,

            age,

            gender,

            prediction,

            result,

            probability,

            model,

            model_version

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,

        (

            assessment_id,

            created_at,

            data.patient_name.strip(),

            data.Age,

            data.Gender,

            int(prediction),

            result,

            probability,

            "Random Forest",

            "1.0",

        )
    )

    connection.commit()

    connection.close()

    # ========================================================
    # RETURN RESPONSE
    # ========================================================

    return {

        "assessment_id": assessment_id,

        "created_at": created_at,

        "patient_name": data.patient_name.strip(),

        "age": data.Age,

        "gender": data.Gender,

        "prediction": int(prediction),

        "result": result,

        "probability": probability,

        "model": "Random Forest",

        "model_version": "1.0",

    }


# ============================================================
# ASSESSMENT HISTORY
# ============================================================

@app.get("/assessments")
def get_assessment_history():

    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT

            assessment_id,

            created_at,

            patient_name,

            age,

            gender,

            prediction,

            result,

            probability,

            model,

            model_version

        FROM assessments

        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()

    connection.close()

    assessments = []

    for row in rows:

        assessments.append(

            {

                "assessment_id":
                    row["assessment_id"],

                "created_at":
                    row["created_at"],

                "patient_name":
                    row["patient_name"],

                "age":
                    row["age"],

                "gender":
                    row["gender"],

                "prediction":
                    row["prediction"],

                "result":
                    row["result"],

                "probability":
                    row["probability"],

                "model":
                    row["model"],

                "model_version":
                    row["model_version"],

            }

        )

    return {

        "count": len(assessments),

        "assessments": assessments,

    }


# ============================================================
# SINGLE ASSESSMENT
# ============================================================

@app.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: str):

    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT

            assessment_id,

            created_at,

            patient_name,

            age,

            gender,

            prediction,

            result,

            probability,

            model,

            model_version

        FROM assessments

        WHERE assessment_id = ?

        """,

        (assessment_id,)

    )

    row = cursor.fetchone()

    connection.close()

    if row is None:

        return {

            "error": "Assessment not found"

        }

    return {

        "assessment_id":
            row["assessment_id"],

        "created_at":
            row["created_at"],

        "patient_name":
            row["patient_name"],

        "age":
            row["age"],

        "gender":
            row["gender"],

        "prediction":
            row["prediction"],

        "result":
            row["result"],

        "probability":
            row["probability"],

        "model":
            row["model"],

        "model_version":
            row["model_version"],

    }


# ============================================================
# PATIENTS
# ============================================================

@app.get("/patients")
def get_patients():

    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT

            patient_name,

            age,

            gender,

            COUNT(*) AS assessment_count,

            MAX(created_at) AS last_assessment,

            SUM(
                CASE
                    WHEN prediction = 1 THEN 1
                    ELSE 0
                END
            ) AS positive_assessments

        FROM assessments

        WHERE patient_name IS NOT NULL
        AND patient_name != ''

        GROUP BY

            patient_name,

            age,

            gender

        ORDER BY last_assessment DESC
        """
    )

    rows = cursor.fetchall()

    connection.close()

    patients = []

    for row in rows:

        patients.append(

            {

                "patient_name":
                    row["patient_name"],

                "age":
                    row["age"],

                "gender":
                    row["gender"],

                "assessment_count":
                    row["assessment_count"],

                "last_assessment":
                    row["last_assessment"],

                "positive_assessments":
                    row["positive_assessments"],

            }

        )

    return {

        "count": len(patients),

        "patients": patients,

    }