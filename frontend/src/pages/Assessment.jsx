import { useState } from "react";
import { useNavigate } from "react-router-dom";

const symptoms = [
  { key: "Polyuria", label: "Polyuria" },
  { key: "Polydipsia", label: "Polydipsia" },
  { key: "sudden_weight_loss", label: "Sudden weight loss" },
  { key: "weakness", label: "Weakness" },
  { key: "Polyphagia", label: "Polyphagia" },
  { key: "Genital_thrush", label: "Genital thrush" },
  { key: "visual_blurring", label: "Visual blurring" },
  { key: "Itching", label: "Itching" },
  { key: "Irritability", label: "Irritability" },
  { key: "delayed_healing", label: "Delayed healing" },
  { key: "partial_paresis", label: "Partial paresis" },
  { key: "muscle_stiffness", label: "Muscle stiffness" },
  { key: "Alopecia", label: "Alopecia" },
  { key: "Obesity", label: "Obesity" },
];

const initialForm = {
  patient_name: "",
  Age: "",
  Gender: "",
  Polyuria: "",
  Polydipsia: "",
  sudden_weight_loss: "",
  weakness: "",
  Polyphagia: "",
  Genital_thrush: "",
  visual_blurring: "",
  Itching: "",
  Irritability: "",
  delayed_healing: "",
  partial_paresis: "",
  muscle_stiffness: "",
  Alopecia: "",
  Obesity: "",
};

function Assessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            Age: Number(formData.Age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to complete the assessment."
        );
      }

      console.log("Prediction response:", data);

      navigate(`/assessment/${data.assessment_id}`, {
        state: {
          result: data,
          patient: formData,
        },
      });

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Unable to connect to the prediction service."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setError("");
  };

  return (
    <div className="assessment-page">

      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            PATIENT ASSESSMENT
          </p>

          <h1>
            New Assessment
          </h1>

          <p className="page-description">
            Enter patient information and symptoms for
            AI-based diabetes risk assessment.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Assessment failed</strong>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* PATIENT INFORMATION */}

        <section className="form-card">

          <div className="form-card-header">
            <div>
              <h2>Patient Information</h2>

              <p>
                Basic patient information required for the assessment.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="patient_name">
                Patient Name
              </label>

              <input
                id="patient_name"
                name="patient_name"
                type="text"
                placeholder="Enter patient name"
                value={formData.patient_name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="Age">
                Age
              </label>

              <input
                id="Age"
                name="Age"
                type="number"
                min="1"
                max="120"
                placeholder="Enter age"
                value={formData.Age}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="Gender">
                Gender
              </label>

              <select
                id="Gender"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>

            </div>

          </div>

        </section>


        {/* SYMPTOMS */}

        <section className="form-card">

          <div className="form-card-header">

            <div>
              <h2>Symptoms</h2>

              <p>
                Select Yes or No for each symptom.
              </p>
            </div>

          </div>

          <div className="symptom-grid">

            {symptoms.map((symptom) => (

              <div
                className="form-field"
                key={symptom.key}
              >

                <label htmlFor={symptom.key}>
                  {symptom.label}
                </label>

                <select
                  id={symptom.key}
                  name={symptom.key}
                  value={formData[symptom.key]}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>

            ))}

          </div>

        </section>


        {/* NOTICE */}

        <div className="assessment-notice">

          <div className="information-icon">
            i
          </div>

          <div>

            <strong>
              Before submitting
            </strong>

            <p>
              Ensure that all patient information and symptoms
              have been entered accurately. The result is
              AI-generated decision support and should not be
              considered a medical diagnosis.
            </p>

          </div>

        </div>


        {/* BUTTONS */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={handleReset}
            disabled={loading}
          >
            Clear Form
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >

            {loading
              ? "Running Assessment..."
              : "Run Assessment →"
            }

          </button>

        </div>

      </form>

    </div>
  );
}

export default Assessment;