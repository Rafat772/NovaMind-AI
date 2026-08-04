from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    APP_NAME = "NovaMind AI Backend"
    APP_VERSION = "1.0.0"

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")


settings = Settings()