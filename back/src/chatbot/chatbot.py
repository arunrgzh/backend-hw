from typing import List, Dict
from src.assistant.gemini_assistant import GeminiAssistant
from src.database import SessionLocal
from src import models
import logging

logger = logging.getLogger(__name__)

class Chatbot:
    def __init__(self):
        self.assistant = GeminiAssistant()
        self.conversation_history: List[Dict] = []
        
    async def process_message(self, message: str, user_id: int) -> str:
        try:
            # Get conversation history from database
            db = SessionLocal()
            try:
                history = db.query(models.Conversation).filter(
                    models.Conversation.user_id == user_id
                ).order_by(models.Conversation.created_at.desc()).limit(5).all()
                
                context = [
                    {"role": msg.role, "content": msg.content}
                    for msg in reversed(history)
                ]
                
                # Get response from assistant
                response = await self.assistant.get_response(message, context)
                
                # Save conversation to database
                new_message = models.Conversation(
                    user_id=user_id,
                    role="user",
                    content=message
                )
                db.add(new_message)
                
                new_response = models.Conversation(
                    user_id=user_id,
                    role="assistant",
                    content=response
                )
                db.add(new_response)
                db.commit()
                
                return response
                
            except Exception as e:
                db.rollback()
                logger.error(f"Database error: {str(e)}")
                raise
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now." 