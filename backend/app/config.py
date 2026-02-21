from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    SECRET_KEY: str = "change-this-to-a-random-secret-key"
    DATABASE_URL: str = "sqlite:///./chatbot.db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = {"env_file": ".env"}


settings = Settings()
