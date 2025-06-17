from .celery_app import app
from .database import SessionLocal
from . import models, schemas
import requests
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@app.task(name="fetch_daily_data")
def fetch_daily_data():
    try:
        # Example API endpoint - replace with your actual data source
        response = requests.get('https://api.example.com/daily-data')
        data = response.json()
        
        db = SessionLocal()
        try:
            # Process and save data to database
            for item in data:
                character = models.Character(
                    title=item.get('title'),
                    description=item.get('description'),
                    created_at=datetime.utcnow()
                )
                db.add(character)
            db.commit()
            logger.info(f"Successfully fetched and saved {len(data)} items")
        except Exception as e:
            db.rollback()
            logger.error(f"Database error: {str(e)}")
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}")
        raise 