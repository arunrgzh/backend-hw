import time
from celery_app import celery_app
from tasks import process_character

def test_celery_redis():
    # Test data
    test_character = {
        "title": "Test Character",
        "description": "This is a test character"
    }
    
    # Send task to Celery
    print("Sending task to Celery...")
    result = process_character.delay(test_character)
    
    # Wait for task to complete
    print("Waiting for task to complete...")
    task_result = result.get(timeout=10)  # Wait up to 10 seconds
    
    print(f"Task completed with result: {task_result}")
    return task_result

if __name__ == "__main__":
    test_celery_redis() 