import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD REAL DATA FROM BACKEND
    // =========================================================

    const loadDashboardData = async () => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/assessments`
            );

            if (!response.ok) {
                throw new Error(
                    `Backend returned ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "REAL DASHBOARD DATA:",
                data
            );

            setAssessments(
                Array.isArray(data.assessments)
                    ? data.assessments
                    : []
            );

        } catch (error) {
            console.error(
                "Dashboard API error:",
                error
            );

            setError(
                "Unable to load dashboard data. Please make sure the FastAPI backend is running."
            );

            setAssessments([]);

        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // LOAD WHEN PAGE OPENS
    // =========================================================

    useEffect(() => {
        loadDashboardData();
    }, []);


    // =========================================================
    // CALCULATE REAL STATISTICS
    // =========================================================

    const totalAssessments = assessments.length;

    const positiveResults = assessments.filter(
        (assessment) =>
            Number(assessment.prediction) === 1
    ).length;

    const completedAssessments = assessments.length;


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================================================
    // NAVIGATION
    // =========================================================

    const openAssessment = (assessmentId) => {
        navigate(
            `/assessment/${assessmentId}`
        );
    };


    const goToAssessment = () => {
        navigate("/assessment");
    };


    const goToHistory = () => {
        navigate("/history");
    };


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <div className="dashboard-page">

                <div className="page-header">
                    <div>

                        <p className="page-eyebrow">
                            OVERVIEW
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p className="page-description">
                            Loading assessment activity...
                        </p>

                    </div>
                </div>

                <div className="dashboard-section">

                    <div className="history-empty">

                        <h2>
                            Loading dashboard
                        </h2>

                        <p>
                            Fetching the latest assessment data.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================
    // DASHBOARD
    // =========================================================

    return (
        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        OVERVIEW
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="page-description">
                        Monitor diabetes assessments and prediction activity.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={goToAssessment}
                >
                    + New Assessment
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="error-message">

                    <strong>
                        Dashboard unavailable
                    </strong>

                    <p>
                        {error}
                    </p>

                    <button
                        className="secondary-button"
                        onClick={loadDashboardData}
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="stats-grid">


                {/* TOTAL PATIENTS / ASSESSMENTS */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Total Assessments
                        </span>

                        <span className="stat-icon">
                            +
                        </span>

                    </div>

                    <strong className="stat-value">
                        {totalAssessments}
                    </strong>

                    <span className="stat-description">
                        Assessments recorded
                    </span>

                </div>


                {/* ASSESSMENTS */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Total Predictions
                        </span>

                        <span className="stat-icon">
                            ▣
                        </span>

                    </div>

                    <strong className="stat-value">
                        {totalAssessments}
                    </strong>

                    <span className="stat-description">
                        AI predictions completed
                    </span>

                </div>


                {/* POSITIVE */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Positive Results
                        </span>

                        <span className="stat-icon">
                            !
                        </span>

                    </div>

                    <strong className="stat-value">
                        {positiveResults}
                    </strong>

                    <span className="stat-description">
                        Require clinical review
                    </span>

                </div>


                {/* COMPLETED */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Completed
                        </span>

                        <span className="stat-icon">
                            ✓
                        </span>

                    </div>

                    <strong className="stat-value">
                        {completedAssessments}
                    </strong>

                    <span className="stat-description">
                        Completed assessments
                    </span>

                </div>

            </div>


            {/* =================================================
                RECENT ASSESSMENTS
            ================================================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Recent Assessments
                        </h2>

                        <p>
                            Latest diabetes prediction activity
                        </p>

                    </div>


                    <button
                        className="secondary-button"
                        onClick={goToHistory}
                    >
                        View All
                    </button>

                </div>


                {assessments.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="history-empty">

                        <h2>
                            No assessments yet
                        </h2>

                        <p>
                            Create your first assessment
                            to see prediction activity here.
                        </p>

                        <button
                            className="primary-button"
                            onClick={goToAssessment}
                        >
                            + New Assessment
                        </button>

                    </div>

                ) : (

                    /* REAL DATABASE DATA */

                    <div className="assessment-table">


                        {/* TABLE HEADER */}

                        <div className="table-header">

                            <span>
                                Assessment ID
                            </span>

                            <span>
                                Date
                            </span>

                            <span>
                                Result
                            </span>

                            <span>
                                Status
                            </span>

                        </div>


                        {/* TABLE ROWS */}

                        {assessments
                            .slice(0, 5)
                            .map((assessment) => (

                                <div
                                    className="table-row"
                                    key={
                                        assessment.assessment_id
                                    }
                                    onClick={() =>
                                        openAssessment(
                                            assessment.assessment_id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                    }}
                                >


                                    {/* ID */}

                                    <span>
                                        {
                                            assessment.assessment_id
                                        }
                                    </span>


                                    {/* DATE */}

                                    <span>
                                        {
                                            formatDate(
                                                assessment.created_at
                                            )
                                        }
                                    </span>


                                    {/* RESULT */}

                                    <span
                                        className={
                                            Number(
                                                assessment.prediction
                                            ) === 1
                                                ? "result-positive"
                                                : "result-negative"
                                        }
                                    >
                                        {
                                            assessment.result
                                        }
                                    </span>


                                    {/* STATUS */}

                                    <span
                                        className={
                                            Number(
                                                assessment.prediction
                                            ) === 1
                                                ? "status-review"
                                                : "status-complete"
                                        }
                                    >
                                        {
                                            Number(
                                                assessment.prediction
                                            ) === 1
                                                ? "Review Required"
                                                : "Completed"
                                        }
                                    </span>

                                </div>

                            ))}

                    </div>

                )}

            </div>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="information-card">

                <div className="information-icon">
                    i
                </div>

                <div>

                    <h3>
                        Clinical Decision Support
                    </h3>

                    <p>
                        This application provides AI-based
                        prediction support using patient symptoms.
                        Predictions are intended to support
                        assessment and should not replace
                        professional medical diagnosis or
                        clinical judgement.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;