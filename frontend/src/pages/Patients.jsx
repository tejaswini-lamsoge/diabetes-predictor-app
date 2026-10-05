import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Patients() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/assessments"
      );

      if (!response.ok) {
        throw new Error("Unable to load patient records.");
      }

      const data = await response.json();

      setAssessments(data.assessments || []);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load patient records. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="history-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            PATIENT MANAGEMENT
          </p>

          <h1>
            Patients
          </h1>

          <p className="page-description">
            View patients who have completed diabetes assessments.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/assessment")}
        >
          + New Assessment
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="error-message">

          <strong>
            Unable to load patients
          </strong>

          <p>
            {error}
          </p>

        </div>
      )}


      {/* LOADING */}

      {loading ? (

        <div className="history-empty">

          <h2>
            Loading patients...
          </h2>

          <p>
            Retrieving patient records.
          </p>

        </div>

      ) : assessments.length === 0 ? (

        <div className="history-empty">

          <h2>
            No patients found
          </h2>

          <p>
            Patients will appear here after their first assessment.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/assessment")}
          >
            Create Assessment
          </button>

        </div>

      ) : (

        <div className="history-card">

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>

                <tr>

                  <th>
                    Patient
                  </th>

                  <th>
                    Assessment ID
                  </th>

                  <th>
                    Age
                  </th>

                  <th>
                    Gender
                  </th>

                  <th>
                    Latest Result
                  </th>

                  <th>
                    Probability
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {assessments.map((assessment) => (

                  <tr key={assessment.assessment_id}>

                    <td>
                      <strong>
                        {assessment.patient_name || "Unknown Patient"}
                      </strong>
                    </td>

                    <td>
                      {assessment.assessment_id}
                    </td>

                    <td>
                      {assessment.age}
                    </td>

                    <td>
                      {assessment.gender}
                    </td>

                    <td>

                      <span
                        className={
                          assessment.prediction === 1
                            ? "status-positive"
                            : "status-negative"
                        }
                      >
                        {assessment.result}
                      </span>

                    </td>

                    <td>
                      {assessment.probability}%
                    </td>

                    <td>
                      {new Date(
                        assessment.created_at
                      ).toLocaleDateString("en-GB")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;