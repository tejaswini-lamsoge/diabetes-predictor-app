import { useEffect, useState } from "react";

function Analytics() {

    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://127.0.0.1:8000/assessments"
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load analytics data."
                );
            }

            const data = await response.json();

            setAssessments(
                data.assessments || []
            );

        } catch (error) {

            console.error(
                "Analytics error:",
                error
            );

            setError(
                "Unable to load analytics data. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }

    };


    const total = assessments.length;

    const positive = assessments.filter(
        (item) => item.prediction === 1
    ).length;

    const negative = assessments.filter(
        (item) => item.prediction === 0
    ).length;


    const positivePercentage =
        total > 0
            ? (positive / total) * 100
            : 0;

    const negativePercentage =
        total > 0
            ? (negative / total) * 100
            : 0;


    const averageProbability =
        total > 0
            ? assessments.reduce(
                  (sum, item) =>
                      sum + Number(item.probability || 0),
                  0
              ) / total
            : 0;


    const averageAge =
        total > 0
            ? assessments.reduce(
                  (sum, item) =>
                      sum + Number(item.age || 0),
                  0
              ) / total
            : 0;


    const maleCount = assessments.filter(
        (item) => item.gender === "Male"
    ).length;


    const femaleCount = assessments.filter(
        (item) => item.gender === "Female"
    ).length;


    if (loading) {

        return (

            <div className="analytics-page">

                <div className="page-header">

                    <div>

                        <p className="page-eyebrow">
                            DATA ANALYTICS
                        </p>

                        <h1>
                            Analytics
                        </h1>

                        <p className="page-description">
                            Analysing stored assessment results.
                        </p>

                    </div>

                </div>


                <div className="analytics-empty">

                    <h2>
                        Loading analytics
                    </h2>

                    <p>
                        Please wait while assessment data is analysed.
                    </p>

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="analytics-page">

                <div className="page-header">

                    <div>

                        <p className="page-eyebrow">
                            DATA ANALYTICS
                        </p>

                        <h1>
                            Analytics
                        </h1>

                    </div>

                </div>


                <div className="analytics-empty">

                    <h2>
                        Unable to load analytics
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-button"
                        onClick={loadAnalytics}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="analytics-page">


            {/* HEADER */}

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        DATA ANALYTICS
                    </p>

                    <h1>
                        Analytics
                    </h1>

                    <p className="page-description">
                        Insights derived from recorded diabetes assessments.
                    </p>

                </div>

            </div>


            {/* KEY METRICS */}

            <div className="analytics-stats-grid">

                <div className="analytics-stat-card">

                    <span>
                        Total Assessments
                    </span>

                    <strong>
                        {total}
                    </strong>

                    <small>
                        Recorded assessments
                    </small>

                </div>


                <div className="analytics-stat-card">

                    <span>
                        Positive Rate
                    </span>

                    <strong>
                        {positivePercentage.toFixed(1)}%
                    </strong>

                    <small>
                        Positive predictions
                    </small>

                </div>


                <div className="analytics-stat-card">

                    <span>
                        Average Probability
                    </span>

                    <strong>
                        {averageProbability.toFixed(1)}%
                    </strong>

                    <small>
                        Model confidence
                    </small>

                </div>


                <div className="analytics-stat-card">

                    <span>
                        Average Patient Age
                    </span>

                    <strong>
                        {averageAge.toFixed(1)}
                    </strong>

                    <small>
                        Years
                    </small>

                </div>

            </div>


            {/* RESULT DISTRIBUTION */}

            <div className="analytics-grid">


                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Prediction Distribution
                        </h2>

                        <p>
                            Positive versus negative predictions.
                        </p>

                    </div>


                    <div className="distribution-item">

                        <div className="distribution-label">

                            <span>
                                Positive
                            </span>

                            <strong>
                                {positive}
                            </strong>

                        </div>


                        <div className="analytics-progress">

                            <div
                                className="analytics-progress-positive"
                                style={{
                                    width: `${positivePercentage}%`
                                }}
                            />

                        </div>

                        <small>
                            {positivePercentage.toFixed(1)}%
                        </small>

                    </div>


                    <div className="distribution-item">

                        <div className="distribution-label">

                            <span>
                                Negative
                            </span>

                            <strong>
                                {negative}
                            </strong>

                        </div>


                        <div className="analytics-progress">

                            <div
                                className="analytics-progress-negative"
                                style={{
                                    width: `${negativePercentage}%`
                                }}
                            />

                        </div>

                        <small>
                            {negativePercentage.toFixed(1)}%
                        </small>

                    </div>

                </div>


                {/* GENDER DISTRIBUTION */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Gender Distribution
                        </h2>

                        <p>
                            Gender breakdown of assessed patients.
                        </p>

                    </div>


                    <div className="analytics-detail-row">

                        <span>
                            Female
                        </span>

                        <strong>
                            {femaleCount}
                        </strong>

                    </div>


                    <div className="analytics-detail-row">

                        <span>
                            Male
                        </span>

                        <strong>
                            {maleCount}
                        </strong>

                    </div>


                    <div className="analytics-detail-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            {total}
                        </strong>

                    </div>

                </div>

            </div>


            {/* MODEL INFORMATION */}

            <div className="analytics-card">

                <div className="analytics-card-header">

                    <h2>
                        Model Performance Overview
                    </h2>

                    <p>
                        Information based on the prediction records currently stored.
                    </p>

                </div>


                <div className="model-overview-grid">

                    <div className="model-item">

                        <span>
                            Model
                        </span>

                        <strong>
                            {assessments.length > 0
                                ? assessments[0].model
                                : "Random Forest"}
                        </strong>

                    </div>


                    <div className="model-item">

                        <span>
                            Model Version
                        </span>

                        <strong>
                            {assessments.length > 0
                                ? assessments[0].model_version
                                : "1.0"}
                        </strong>

                    </div>


                    <div className="model-item">

                        <span>
                            Predictions
                        </span>

                        <strong>
                            {total}
                        </strong>

                    </div>


                    <div className="model-item">

                        <span>
                            Positive Predictions
                        </span>

                        <strong>
                            {positive}
                        </strong>

                    </div>

                </div>

            </div>


            {/* DISCLAIMER */}

            <div className="information-card">

                <div className="information-icon">
                    i
                </div>

                <div>

                    <h3>
                        Analytics Notice
                    </h3>

                    <p>
                        These analytics describe the assessment records
                        stored in the application. Prediction statistics
                        should be interpreted alongside clinical information
                        and must not be treated as a medical diagnosis.
                    </p>

                </div>

            </div>

        </div>

    );
}

export default Analytics;