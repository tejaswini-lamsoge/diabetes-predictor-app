import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://127.0.0.1:8000/assessments"
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load assessment history."
                );
            }

            const data = await response.json();

            console.log(
                "Assessment history:",
                data
            );

            setAssessments(
                data.assessments || []
            );

        } catch (error) {
            console.error(
                "History error:",
                error
            );

            setError(
                "Unable to load assessment history. Please make sure the backend is running."
            );

        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return new Date(
            dateString
        ).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <div className="history-page">

                <div className="page-header">

                    <div>

                        <p className="page-eyebrow">
                            PATIENT RECORDS
                        </p>

                        <h1>
                            Assessment History
                        </h1>

                        <p className="page-description">
                            Loading previous assessments...
                        </p>

                    </div>

                </div>

                <div className="history-empty">

                    <h2>
                        Loading assessments
                    </h2>

                    <p>
                        Please wait while assessment records are loaded.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="history-page">

                <div className="page-header">

                    <div>

                        <p className="page-eyebrow">
                            PATIENT RECORDS
                        </p>

                        <h1>
                            Assessment History
                        </h1>

                    </div>

                </div>

                <div className="history-empty">

                    <h2>
                        Unable to load assessment history
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-button"
                        onClick={loadHistory}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="history-page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        PATIENT RECORDS
                    </p>

                    <h1>
                        Assessment History
                    </h1>

                    <p className="page-description">
                        View previous AI-based diabetes assessments.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={() => navigate("/assessment")}
                >
                    + New Assessment
                </button>

            </div>


            {/* SUMMARY */}

            <div className="history-summary">

                <div className="history-summary-card">

                    <span>
                        Total Assessments
                    </span>

                    <strong>
                        {assessments.length}
                    </strong>

                </div>


                <div className="history-summary-card">

                    <span>
                        Positive Results
                    </span>

                    <strong>
                        {
                            assessments.filter(
                                (item) =>
                                    item.prediction === 1
                            ).length
                        }
                    </strong>

                </div>


                <div className="history-summary-card">

                    <span>
                        Negative Results
                    </span>

                    <strong>
                        {
                            assessments.filter(
                                (item) =>
                                    item.prediction === 0
                            ).length
                        }
                    </strong>

                </div>

            </div>


            {/* HISTORY */}

            {assessments.length === 0 ? (

                <div className="history-empty">

                    <h2>
                        No assessments yet
                    </h2>

                    <p>
                        Completed assessments will appear here.
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
                                        Patient Name
                                    </th>

                                    <th>
                                        Assessment ID
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Age
                                    </th>

                                    <th>
                                        Gender
                                    </th>

                                    <th>
                                        Result
                                    </th>

                                    <th>
                                        Probability
                                    </th>

                                    <th>
                                        Model
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {assessments.map(
                                    (assessment) => (

                                        <tr
                                            key={
                                                assessment.assessment_id
                                            }
                                        >

                                            {/* PATIENT NAME */}

                                            <td>

                                                <strong>
                                                    {
                                                        assessment.patient_name ||
                                                        "-"
                                                    }
                                                </strong>

                                            </td>


                                            {/* ASSESSMENT ID */}

                                            <td>

                                                <strong>
                                                    {
                                                        assessment.assessment_id
                                                    }
                                                </strong>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {
                                                    formatDate(
                                                        assessment.created_at
                                                    )
                                                }

                                            </td>


                                            {/* AGE */}

                                            <td>
                                                {
                                                    assessment.age
                                                }
                                            </td>


                                            {/* GENDER */}

                                            <td>
                                                {
                                                    assessment.gender
                                                }
                                            </td>


                                            {/* RESULT */}

                                            <td>

                                                <span
                                                    className={
                                                        assessment.prediction === 1
                                                            ? "status-positive"
                                                            : "status-negative"
                                                    }
                                                >

                                                    {
                                                        assessment.result
                                                    }

                                                </span>

                                            </td>


                                            {/* PROBABILITY */}

                                            <td>

                                                {
                                                    assessment.probability
                                                }%

                                            </td>


                                            {/* MODEL */}

                                            <td>

                                                {
                                                    assessment.model
                                                }

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    className="history-view-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/assessment/${assessment.assessment_id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

export default History;