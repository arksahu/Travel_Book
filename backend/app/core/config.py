import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    """
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    PROJECT_NAME: str = "WanderWise API"
    VERSION: str = "1.0.0"

    # CORS Configuration
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://wanderwise.vercel.app"
    ]

    # Supabase Credentials
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Generative AI Service Layer
    AI_PROVIDER: str = "gemini"  # "gemini" or "openai"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    AI_MODEL_NAME: str = "gemini-1.5-flash"
    AI_REQUEST_TIMEOUT_SECONDS: int = 45
    AI_MAX_RETRIES: int = 2

    # Demo Mode Override
    ENABLE_DEMO_MODE: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @property
    def is_supabase_configured(self) -> bool:
        return bool(
            self.SUPABASE_URL and 
            self.SUPABASE_KEY and 
            "your-project" not in self.SUPABASE_URL
        )

    @property
    def is_ai_configured(self) -> bool:
        if self.AI_PROVIDER == "gemini":
            return bool(self.GEMINI_API_KEY and "your-gemini" not in self.GEMINI_API_KEY)
        if self.AI_PROVIDER == "openai":
            return bool(self.OPENAI_API_KEY and "your-openai" not in self.OPENAI_API_KEY)
        return False


settings = Settings()
