from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    APP_NAME = "NovaMind AI Backend"
    APP_VERSION = "1.0.0"

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")

    MONGODB_URL = os.getenv("MONGODB_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")

    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

    # Document Upload & Processing Config
    UPLOAD_DIR = os.getenv(
        "UPLOAD_DIR",
        os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
    )
    MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"]


settings = Settings()