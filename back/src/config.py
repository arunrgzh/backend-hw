from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str  
    redis_url: str
    celery_broker_url: str
    celery_result_backend: str
    gemini_api_key: str

    class Config:
        env_file = ".env"  

settings = Settings()
