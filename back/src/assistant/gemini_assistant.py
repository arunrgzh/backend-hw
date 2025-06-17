import google.generativeai as genai
from src.config import settings
import logging
import traceback

logger = logging.getLogger(__name__)

class GeminiAssistant:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.chat = self.model.start_chat(history=[])
        
    async def get_response(self, message: str, context: list = None) -> str:
        try:
            # Reset chat history if context is provided
            if context:
                self.chat = self.model.start_chat(history=context)
            
            # Use synchronous call in async context
            import asyncio
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, self.chat.send_message, message)
            return response.text
        except Exception as e:
            logger.error(f"Error getting response from Gemini: {str(e)}")
            logger.error(traceback.format_exc())
            return "I apologize, but I'm having trouble processing your request right now." 