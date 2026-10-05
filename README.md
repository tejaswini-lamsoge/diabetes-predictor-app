# AI-Based Diabetes Prediction Platform

An AI-powered web application for predicting diabetes risk based on patient age, gender, and diabetes-related symptoms.

The application combines a machine learning model with a modern React frontend and FastAPI backend to provide an end-to-end assessment platform with prediction results, patient records, assessment history, analytics, and reports.

---

## Overview

Diabetes can be difficult to identify at an early stage because symptoms can vary between individuals.

This project uses a machine learning model trained on symptom-based patient data to predict whether a patient is likely to have diabetes.

The system allows users to:

- Enter patient information
- Select diabetes-related symptoms
- Generate an AI-based prediction
- View prediction probability
- Store assessment results
- View assessment history
- View individual assessment details
- Manage patient records
- View analytics and reports
- Track previous assessments

> **Important:** This application is an AI-based decision-support system and is not intended to replace professional medical diagnosis or clinical judgment.

---

## Features

### Patient Assessment

Users can enter:

- Patient age
- Gender
- Polyuria
- Polydipsia
- Sudden weight loss
- Weakness
- Polyphagia
- Genital thrush
- Visual blurring
- Itching
- Irritability
- Delayed healing
- Partial paresis
- Muscle stiffness
- Alopecia
- Obesity

The application sends the information to the FastAPI backend for prediction.

---

### AI Prediction

The backend processes the patient information and uses a trained Random Forest model to generate:

- Prediction
- Positive probability
- Assessment ID
- Assessment timestamp
- Model name
- Model version

Example response:

```json
{
  "assessment_id": "DP-20261002-B263A2",
  "created_at": "2026-10-02T21:40:33.456802",
  "prediction": 1,
  "result": "Positive",
  "probability": 84,
  "model": "Random Forest",
  "model_version": "1.0"
}