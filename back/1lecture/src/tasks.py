from back.1lecture.src.celery_app import celery_worker
import time

@celery_worker.task(name="process_character")
def process_character(character_data: dict):
    # Simulate some processing time
    time.sleep(5)
    return {"status": "processed", "data": character_data} 