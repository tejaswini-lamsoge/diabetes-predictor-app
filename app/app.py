import streamlit as st
import pandas as pd
import joblib
from pathlib import Path


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="AI Based Diabetes Prediction App",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# FILE PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "diabetes_model.pkl"
FEATURE_PATH = BASE_DIR / "models" / "feature_names.pkl"


# ============================================================
# LOAD MODEL
# ============================================================

@st.cache_resource
def load_model():
    return joblib.load(MODEL_PATH)


@st.cache_resource
def load_features():
    return joblib.load(FEATURE_PATH)


try:
    model = load_model()
    feature_names = load_features()

except Exception as e:
    st.error("Unable to load the trained model.")
    st.code(str(e))
    st.stop()


# ============================================================
# BURGUNDY LIGHT THEME
# ============================================================

st.markdown(
    """
    <style>

    /* -------------------------------------------------------
       MAIN APPLICATION
    ------------------------------------------------------- */

    .stApp {
        background-color: #FAF8F8;
        color: #2D2527;
    }


    /* -------------------------------------------------------
       SIDEBAR
    ------------------------------------------------------- */

    [data-testid="stSidebar"] {
        background-color: #5A1F2B;
    }

    [data-testid="stSidebar"] * {
        color: #FFFFFF !important;
    }

    [data-testid="stSidebar"] .stRadio label {
        padding: 10px 8px;
        border-radius: 8px;
        transition: 0.2s;
    }

    [data-testid="stSidebar"] .stRadio label:hover {
        background-color: #722C3A;
    }


    /* -------------------------------------------------------
       HEADINGS
    ------------------------------------------------------- */

    h1 {
        color: #5A1F2B !important;
        font-weight: 700 !important;
    }

    h2 {
        color: #6B2635 !important;
        font-weight: 650 !important;
    }

    h3 {
        color: #722C3A !important;
        font-weight: 600 !important;
    }


    /* -------------------------------------------------------
       TOP HEADER
    ------------------------------------------------------- */

    .app-header {
        background: linear-gradient(
            135deg,
            #5A1F2B,
            #7A3040
        );

        padding: 28px 32px;
        border-radius: 16px;
        margin-bottom: 25px;

        box-shadow: 0 5px 18px rgba(90, 31, 43, 0.15);
    }

    .app-header h1 {
        color: white !important;
        margin: 0;
        font-size: 32px;
    }

    .app-header p {
        color: #F7EDEF !important;
        margin-top: 8px;
        font-size: 16px;
    }


    /* -------------------------------------------------------
       CARDS
    ------------------------------------------------------- */

    .info-card {
        background-color: #FFFFFF;
        border: 1px solid #E7DDE0;
        border-radius: 14px;
        padding: 22px;
        margin-bottom: 18px;

        box-shadow: 0 3px 12px rgba(70, 40, 45, 0.06);
    }

    .info-card h3 {
        margin-top: 0;
    }


    /* -------------------------------------------------------
       STAT CARDS
    ------------------------------------------------------- */

    .stat-card {
        background-color: #FFFFFF;
        border: 1px solid #E5DADD;
        border-radius: 14px;
        padding: 20px;
        text-align: center;

        box-shadow: 0 3px 12px rgba(70, 40, 45, 0.06);
    }

    .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: #5A1F2B;
    }

    .stat-label {
        font-size: 14px;
        color: #76666A;
        margin-top: 5px;
    }


    /* -------------------------------------------------------
       PREDICTION RESULT
    ------------------------------------------------------- */

    .prediction-positive {
        background-color: #F9E9EC;
        border-left: 6px solid #8B2638;
        border-radius: 12px;
        padding: 24px;
        margin-top: 15px;
    }

    .prediction-negative {
        background-color: #EDF7F0;
        border-left: 6px solid #3F7D55;
        border-radius: 12px;
        padding: 24px;
        margin-top: 15px;
    }


    /* -------------------------------------------------------
       SECTION TITLE
    ------------------------------------------------------- */

    .section-title {
        color: #5A1F2B;
        font-size: 22px;
        font-weight: 700;
        margin-top: 0px;
        margin-bottom: 15px;
    }


    /* -------------------------------------------------------
       BUTTON
    ------------------------------------------------------- */

    .stButton > button {
        background-color: #6B2635;
        color: white;
        border: none;
        border-radius: 9px;
        padding: 10px 24px;
        font-weight: 600;
        transition: 0.2s;
    }

    .stButton > button:hover {
        background-color: #8B3547;
        color: white;
    }


    /* -------------------------------------------------------
       INPUTS
    ------------------------------------------------------- */

    div[data-baseweb="select"] > div {
        border-radius: 8px;
    }

    input {
        border-radius: 8px !important;
    }


    /* -------------------------------------------------------
       FOOTER
    ------------------------------------------------------- */

    .footer {
        text-align: center;
        color: #806F74;
        font-size: 13px;
        padding: 25px 0 10px 0;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.markdown(
        """
        <div style="text-align:center; padding:10px 0 20px 0;">
            <div style="font-size:42px;"></div>
            <h2 style="color:white !important; margin-bottom:5px;">
                AI Diabetes
            </h2>
            <p style="color:#EBDDE0 !important; font-size:13px;">
                Prediction Application
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown("---")

    page = st.radio(
        "Navigation",
        [
            "Dashboard",
            "Diabetes Prediction",
            "Model Insights",
            "About"
        ]
    )

    st.markdown("---")

    st.markdown(
        """
        <div style="font-size:12px; color:#EBDDE0 !important;">
            <b>Machine Learning Model</b><br>
            Random Forest Classifier
            <br><br>
            Built for educational and
            demonstration purposes.
        </div>
        """,
        unsafe_allow_html=True
    )


# ============================================================
# HEADER
# ============================================================

st.markdown(
    """
    <div class="app-header">
        <h1>AI Based Diabetes Prediction App</h1>
        <p>
            A machine-learning application that analyses selected
            patient information and symptoms to provide a diabetes
            classification prediction.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)


# ============================================================
# DASHBOARD
# ============================================================

if page == "Dashboard":

    st.markdown(
        '<div class="section-title">Welcome</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="info-card">

        <h3>AI-Based Diabetes Prediction</h3>

        <p>
        This application uses a trained <b>Random Forest machine-learning
        model</b> to analyse patient information and selected symptoms.
        </p>

        <p>
        The application provides a classification of the supplied input
        as <b>Positive</b> or <b>Negative</b> according to patterns
        learned from the training dataset.
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )

    # Statistics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">16</div>
                <div class="stat-label">Input Features</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col2:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">520</div>
                <div class="stat-label">Dataset Records</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col3:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">92.16%</div>
                <div class="stat-label">Test Accuracy</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col4:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">94%</div>
                <div class="stat-label">Best CV Accuracy</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown("<br>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:

        st.markdown(
            """
            <div class="info-card">

            <h3> How it works</h3>

            <ol>
                <li>Enter basic patient information.</li>
                <li>Select the relevant symptoms.</li>
                <li>The trained Random Forest model processes the input.</li>
                <li>The application displays the predicted classification.</li>
                <li>The prediction probability is also shown.</li>
            </ol>

            </div>
            """,
            unsafe_allow_html=True
        )

    with col2:

        st.markdown(
            """
            <div class="info-card">

            <h3> Machine Learning</h3>

            <p>
            The final model used in this application is a
            <b>Random Forest Classifier</b>.
            </p>

            <p>
            During model evaluation, Random Forest achieved:
            </p>

            <ul>
                <li>Cross-validation accuracy: <b>94%</b></li>
                <li>Final test accuracy: <b>92.16%</b></li>
            </ul>

            </div>
            """,
            unsafe_allow_html=True
        )

    st.warning(
        "This application is intended for educational and demonstration "
        "purposes only. It is not a medical diagnostic tool."
    )


# ============================================================
# DIABETES PREDICTION
# ============================================================

elif page == "Diabetes Prediction":

    st.markdown(
        '<div class="section-title">Patient Information</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="info-card">
        Enter the information below and select the symptoms that apply.
        </div>
        """,
        unsafe_allow_html=True
    )

    # --------------------------------------------------------
    # BASIC INFORMATION
    # --------------------------------------------------------

    col1, col2 = st.columns(2)

    with col1:

        age = st.number_input(
            "Age",
            min_value=1,
            max_value=120,
            value=40,
            step=1
        )

    with col2:

        gender = st.selectbox(
            "Gender",
            ["Male", "Female"]
        )


    # --------------------------------------------------------
    # SYMPTOMS
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">Symptoms</div>',
        unsafe_allow_html=True
    )

    col1, col2, col3 = st.columns(3)

    with col1:

        polyuria = st.selectbox(
            "Polyuria",
            ["No", "Yes"]
        )

        sudden_weight_loss = st.selectbox(
            "Sudden weight loss",
            ["No", "Yes"]
        )

        polyphagia = st.selectbox(
            "Polyphagia",
            ["No", "Yes"]
        )

        visual_blurring = st.selectbox(
            "Visual blurring",
            ["No", "Yes"]
        )

        irritability = st.selectbox(
            "Irritability",
            ["No", "Yes"]
        )

    with col2:

        polydipsia = st.selectbox(
            "Polydipsia",
            ["No", "Yes"]
        )

        weakness = st.selectbox(
            "Weakness",
            ["No", "Yes"]
        )

        genital_thrush = st.selectbox(
            "Genital thrush",
            ["No", "Yes"]
        )

        itching = st.selectbox(
            "Itching",
            ["No", "Yes"]
        )

        delayed_healing = st.selectbox(
            "Delayed healing",
            ["No", "Yes"]
        )

    with col3:

        partial_paresis = st.selectbox(
            "Partial paresis",
            ["No", "Yes"]
        )

        muscle_stiffness = st.selectbox(
            "Muscle stiffness",
            ["No", "Yes"]
        )

        alopecia = st.selectbox(
            "Alopecia",
            ["No", "Yes"]
        )

        obesity = st.selectbox(
            "Obesity",
            ["No", "Yes"]
        )


    # --------------------------------------------------------
    # CONVERT INPUTS TO MODEL FORMAT
    # --------------------------------------------------------

    gender_value = 1 if gender == "Male" else 0

    def yes_no(value):
        return 1 if value == "Yes" else 0


    input_data = pd.DataFrame(
        [[
            age,
            gender_value,
            yes_no(polyuria),
            yes_no(polydipsia),
            yes_no(sudden_weight_loss),
            yes_no(weakness),
            yes_no(polyphagia),
            yes_no(genital_thrush),
            yes_no(visual_blurring),
            yes_no(itching),
            yes_no(irritability),
            yes_no(delayed_healing),
            yes_no(partial_paresis),
            yes_no(muscle_stiffness),
            yes_no(alopecia),
            yes_no(obesity)
        ]],
        columns=feature_names
    )


    # --------------------------------------------------------
    # PREDICT BUTTON
    # --------------------------------------------------------

    st.markdown("<br>", unsafe_allow_html=True)

    col1, col2, col3 = st.columns([1, 2, 1])

    with col2:

        predict_button = st.button(
            "Predict Diabetes",
            use_container_width=True
        )


    # --------------------------------------------------------
    # PREDICTION
    # --------------------------------------------------------

    if predict_button:

        prediction = model.predict(input_data)[0]

        # Probability
        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(input_data)[0]

            probability_negative = probabilities[0]
            probability_positive = probabilities[1]

        else:

            probability_positive = None
            probability_negative = None


        # ----------------------------------------------------
        # POSITIVE
        # ----------------------------------------------------

        if prediction == 1:

            st.markdown(
                f"""
                <div class="prediction-positive">

                <h2>Prediction Result</h2>

                <h1 style="color:#8B2638 !important;">
                    Positive
                </h1>

                <p>
                Based on the information provided, the trained
                machine-learning model classified this input as
                <b>Positive</b>.
                </p>

                </div>
                """,
                unsafe_allow_html=True
            )

        # ----------------------------------------------------
        # NEGATIVE
        # ----------------------------------------------------

        else:

            st.markdown(
                f"""
                <div class="prediction-negative">

                <h2>Prediction Result</h2>

                <h1 style="color:#3F7D55 !important;">
                    Negative
                </h1>

                <p>
                Based on the information provided, the trained
                machine-learning model classified this input as
                <b>Negative</b>.
                </p>

                </div>
                """,
                unsafe_allow_html=True
            )


        # ----------------------------------------------------
        # PROBABILITY
        # ----------------------------------------------------

        if probability_positive is not None:

            st.markdown(
                '<div class="section-title">Prediction Probability</div>',
                unsafe_allow_html=True
            )

            col1, col2 = st.columns(2)

            with col1:

                st.metric(
                    "Positive Probability",
                    f"{probability_positive * 100:.2f}%"
                )

                st.progress(float(probability_positive))

            with col2:

                st.metric(
                    "Negative Probability",
                    f"{probability_negative * 100:.2f}%"
                )

                st.progress(float(probability_negative))


        st.info(
            "The prediction represents the output of the trained machine-learning "
            "model and should not be interpreted as a medical diagnosis."
        )


# ============================================================
# MODEL INSIGHTS
# ============================================================

elif page == "Model Insights":

    st.markdown(
        '<div class="section-title">Model Performance</div>',
        unsafe_allow_html=True
    )

    col1, col2, col3 = st.columns(3)

    with col1:

        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">92.16%</div>
                <div class="stat-label">Final Test Accuracy</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col2:

        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">94%</div>
                <div class="stat-label">Best Cross-Validation Accuracy</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col3:

        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-number">50</div>
                <div class="stat-label">Random Forest Trees</div>
            </div>
            """,
            unsafe_allow_html=True
        )


    st.markdown("<br>", unsafe_allow_html=True)

    # --------------------------------------------------------
    # FEATURE IMPORTANCE
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">Feature Importance</div>',
        unsafe_allow_html=True
    )

    if hasattr(model, "feature_importances_"):

        importance_df = pd.DataFrame(
            {
                "Feature": feature_names,
                "Importance": model.feature_importances_
            }
        )

        importance_df = importance_df.sort_values(
            by="Importance",
            ascending=False
        )

        st.dataframe(
            importance_df,
            use_container_width=True,
            hide_index=True
        )

        st.bar_chart(
            importance_df.set_index("Feature")["Importance"]
        )


    # --------------------------------------------------------
    # CLASSIFICATION REPORT
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">Model Evaluation</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="info-card">

        <h3>Random Forest Evaluation</h3>

        <p>
        The final Random Forest model achieved a test accuracy of
        <b>92.16%</b> on the held-out test dataset.
        </p>

        <p>
        Five-fold cross-validation produced a best mean accuracy of
        approximately <b>94%</b>.
        </p>

        <p>
        These values describe performance on this particular dataset
        and test split. They should not be interpreted as clinical
        diagnostic accuracy.
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )


# ============================================================
# ABOUT
# ============================================================

elif page == "About":

    st.markdown(
        '<div class="section-title">About the Application</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="info-card">

        <h3>AI Based Diabetes Prediction App</h3>

        <p>
        This project demonstrates how machine-learning techniques can
        be used to analyse structured health-related data.
        </p>

        <h3>Technology Stack</h3>

        <ul>
            <li>Python</li>
            <li>Pandas</li>
            <li>Scikit-learn</li>
            <li>Random Forest Classifier</li>
            <li>Joblib</li>
            <li>Streamlit</li>
        </ul>

        <h3>Machine Learning Workflow</h3>

        <ol>
            <li>Dataset collection</li>
            <li>Data exploration</li>
            <li>Data cleaning</li>
            <li>Categorical encoding</li>
            <li>Train/test split</li>
            <li>Model training</li>
            <li>Model comparison</li>
            <li>Cross-validation</li>
            <li>Hyperparameter tuning</li>
            <li>Final model evaluation</li>
            <li>Application deployment</li>
        </ol>

        </div>
        """,
        unsafe_allow_html=True
    )

    st.warning(
        "Important: This application is an educational machine-learning "
        "project. It is not intended to diagnose, treat, prevent, or "
        "replace professional medical advice."
    )


# ============================================================
# FOOTER
# ============================================================

st.markdown(
    """
    <div class="footer">
        AI Based Diabetes Prediction App
        <br>
        Machine Learning Demonstration Project
    </div>
    """,
    unsafe_allow_html=True
)