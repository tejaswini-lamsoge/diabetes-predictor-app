from pathlib import Path

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


# ============================================================
# DATABASE PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATABASE_PATH = BASE_DIR / "database" / "diabetes_app.db"

DATABASE_PATH.parent.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# DATABASE URL
# ============================================================

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


# ============================================================
# DATABASE ENGINE
# ============================================================

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    },
)


# ============================================================
# SESSION
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# BASE
# ============================================================

Base = declarative_base()


# ============================================================
# ASSESSMENT TABLE
# ============================================================

class Assessment(Base):

    __tablename__ = "assessments"


    # --------------------------------------------------------
    # Primary key
    # --------------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )


    # --------------------------------------------------------
    # Assessment information
    # --------------------------------------------------------

    assessment_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )


    created_at = Column(
        DateTime,
        nullable=False,
    )


    # --------------------------------------------------------
    # Patient information
    # --------------------------------------------------------

    age = Column(
        Integer,
        nullable=False,
    )


    gender = Column(
        String,
        nullable=False,
    )


    # --------------------------------------------------------
    # Symptoms
    # --------------------------------------------------------

    polyuria = Column(String, nullable=False)

    polydipsia = Column(String, nullable=False)

    sudden_weight_loss = Column(
        String,
        nullable=False,
    )

    weakness = Column(String, nullable=False)

    polyphagia = Column(String, nullable=False)

    genital_thrush = Column(
        String,
        nullable=False,
    )

    visual_blurring = Column(
        String,
        nullable=False,
    )

    itching = Column(String, nullable=False)

    irritability = Column(
        String,
        nullable=False,
    )

    delayed_healing = Column(
        String,
        nullable=False,
    )

    partial_paresis = Column(
        String,
        nullable=False,
    )

    muscle_stiffness = Column(
        String,
        nullable=False,
    )

    alopecia = Column(
        String,
        nullable=False,
    )

    obesity = Column(
        String,
        nullable=False,
    )


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = Column(
        Integer,
        nullable=False,
    )


    result = Column(
        String,
        nullable=False,
    )


    probability = Column(
        Float,
        nullable=False,
    )


    # --------------------------------------------------------
    # Model information
    # --------------------------------------------------------

    model = Column(
        String,
        nullable=False,
    )


    model_version = Column(
        String,
        nullable=False,
    )


# ============================================================
# CREATE TABLES
# ============================================================

Base.metadata.create_all(
    bind=engine
)