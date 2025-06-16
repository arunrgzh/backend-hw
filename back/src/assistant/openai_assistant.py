from openai import OpenAI
from back.1lecture.src.config import settings
import logging

logger = logging.getLogger(__name__)

class OpenAIAssistant:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-3.5-turbo"
        
    async def get_response(self, message: str, context: list = None) -> str:
        try:
            messages = []
            if context:
                messages.extend(context)
            messages.append({"role": "user", "content": message})
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=150
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error getting response from OpenAI: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now." 