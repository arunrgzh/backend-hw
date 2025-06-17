import google.generativeai as genai
from src.config import settings
import logging
import traceback

logger = logging.getLogger(__name__)

class GeminiAssistant:
    def __init__(self):
        try:
            logger.info("Initializing Gemini Assistant...")
            genai.configure(api_key=settings.gemini_api_key)
            logger.info("API key configured successfully")
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("Model initialized successfully")
            self.chat = self.model.start_chat(history=[])
            logger.info("Chat session started successfully")
        except Exception as e:
            logger.error(f"Error during initialization: {str(e)}")
            logger.error(traceback.format_exc())
            raise
        
    async def get_response(self, message: str, context: list = None) -> str:
        try:
            logger.info(f"Processing message: {message[:50]}...")  # Log first 50 chars of message
            # Reset chat history if context is provided
            if context:
                logger.info(f"Resetting chat with context of length: {len(context)}")
                self.chat = self.model.start_chat(history=context)
            
            # Use synchronous call in async context
            import asyncio
            loop = asyncio.get_event_loop()
            logger.info("Sending message to Gemini...")
            response = await loop.run_in_executor(None, self.chat.send_message, message)
            logger.info("Successfully received response from Gemini")
            return response.text
        except Exception as e:
            logger.error(f"Error getting response from Gemini: {str(e)}")
            logger.error(traceback.format_exc())
            return f"Error: {str(e)}"  # Return actual error for debugging
        finally:
            # Ensure the chat history is reset after the operation
            self.chat = self.model.start_chat(history=[]) 