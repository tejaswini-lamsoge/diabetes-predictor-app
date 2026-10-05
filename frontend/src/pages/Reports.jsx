import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Reports() {
    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://127.0.0.1:8000/assessments"
            );

            if (!response.ok) {
                throw new Error("Unable to load assessment data.");
            }

            const data = await response.json();

            setAssessments(data.assessments || []);

        } catch (error) {
            console.error("Reports error:", error);

            setError(
                "Unable to load report data. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    const positiveCount = assessments.filter(
        (item) => item.prediction === 1
    ).length;

    const negativeCount = assessments.filter(
        (item) => item.prediction === 0
    ).length;

    const totalCount = assessments.length;

    const positiveRate =
        totalCount > 0
            ? ((positiveCount / totalCount) * 100).toFixed(1)
            : 0;

    const averageProbability =
        totalCount > 0
            ? (
                  assessments.reduce(
                      (total, item) =>
                          total + Number(item.probability || 0),
                      0
                  ) / totalCount
              ).toFixed(1)
            : 0;

    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return new Date(dateString).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="reports-page">

                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">
                            REPORTING
                        </p>

                        <h1>
                            Reports
                        </h1>

                        <p className="page-description">
                            Generating reports from assessment records.
                        </p>
                    </div>
                </div>

                <div className="report-empty">
                    <h2>
                        Loading report data
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
            <div className="reports-page">

                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">
                            REPORTING
                        </p>

                        <h1>
                            Reports
                        </h1>
                    </div>
                </div>

                <div className="report-empty">

                    <h2>
                        Unable to load reports
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-button"
                        onClick={loadReports}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="reports-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        REPORTING
                    </p>

                    <h1>
                        Reports
                    </h1>

                    <p className="page-description">
                        Summary of AI-based diabetes assessment activity.
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

            <div className="report-stats-grid">

                <div className="report-stat-card">

                    <span>
                        Total Assessments
                    </span>

                    <strong>
                        {totalCount}
                    </strong>

                    <small>
                        All recorded assessments
                    </small>

                </div>


                <div className="report-stat-card">

                    <span>
                        Positive Results
                    </span>

                    <strong className="report-positive">
                        {positiveCount}
                    </strong>

                    <small>
                        {positiveRate}% of assessments
                    </small>

                </div>


                <div className="report-stat-card">

                    <span>
                        Negative Results
                    </span>

                    <strong className="report-negative">
                        {negativeCount}
                    </strong>

                    <small>
                        {totalCount > 0
                            ? ((negativeCount / totalCount) * 100).toFixed(1)
                            : 0}% of assessments
                    </small>

                </div>


                <div className="report-stat-card">

                    <span>
                        Average Probability
                    </span>

                    <strong>
                        {averageProbability}%
                    </strong>

                    <small>
                        Across all assessments
                    </small>

                </div>

            </div>


            {/* REPORT TABLE */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Assessment Report
                        </h2>

                        <p>
                            Detailed record of completed AI assessments.
                        </p>

                    </div>

                </div>


                {assessments.length === 0 ? (

                    <div className="report-empty">

                        <h2>
                            No assessment data
                        </h2>

                        <p>
                            Complete an assessment to generate report data.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() => navigate("/assessment")}
                        >
                            Create Assessment
                        </button>

                    </div>

                ) : (

                    <div className="report-table-wrapper">

                        <table className="report-table">

                            <thead>

                                <tr>

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

                                            <td>
                                                <strong>
                                                    {
                                                        assessment.assessment_id
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    formatDate(
                                                        assessment.created_at
                                                    )
                                                }
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
                                                    {
                                                        assessment.result
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {
                                                    assessment.probability
                                                }%
                                            </td>

                                            <td>
                                                {
                                                    assessment.model
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* CLINICAL NOTICE */}

            <div className="information-card">

                <div className="information-icon">
                    i
                </div>

                <div>

                    <h3>
                        Clinical Decision Support
                    </h3>

                    <p>
                        Reports are generated from stored AI assessment
                        records. They are intended to support clinical
                        review and should not replace professional
                        medical diagnosis or clinical judgement.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Reports;