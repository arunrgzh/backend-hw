from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str  # this will be loaded from the .env file

    class Config:
        env_file = ".env"  # specify that .env file is being used

# Create an instance of Settings
settings = Settings()
