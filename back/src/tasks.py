from .celery_app import app
import time

@app.task(name="process_character")
def process_character(character_data: dict):
    # Simulate some processing time
    time.sleep(5)
    return {"status": "processed", "data": character_data} 