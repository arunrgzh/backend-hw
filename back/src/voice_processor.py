import base64
import io
import speech_recognition as sr
from gtts import gTTS
import tempfile
import os
from pydub import AudioSegment
import logging

logger = logging.getLogger(__name__)

class VoiceProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        
    def audio_to_text(self, audio_data: str) -> str:
        """
        Convert base64 encoded audio to text using speech recognition
        """
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Convert to audio segment
            audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="webm")
            
            # Export as WAV for speech recognition
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                audio.export(temp_file.name, format="wav")
                
                # Use speech recognition
                with sr.AudioFile(temp_file.name) as source:
                    audio_data = self.recognizer.record(source)
                    text = self.recognizer.recognize_google(audio_data)
                    
                # Clean up temp file
                os.unlink(temp_file.name)
                
                return text
                
        except Exception as e:
            logger.error(f"Error converting audio to text: {str(e)}")
            raise Exception("Failed to convert audio to text")
    
    def text_to_audio(self, text: str, language: str = "en") -> str:
        """
        Convert text to base64 encoded audio using gTTS
        """
        try:
            # Create temporary file for audio
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
                # Generate speech
                tts = gTTS(text=text, lang=language, slow=False)
                tts.save(temp_file.name)
                
                # Read the audio file
                with open(temp_file.name, "rb") as audio_file:
                    audio_data = audio_file.read()
                
                # Clean up temp file
                os.unlink(temp_file.name)
                
                # Convert to base64
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                
                return audio_base64
                
        except Exception as e:
            logger.error(f"Error converting text to audio: {str(e)}")
            raise Exception("Failed to convert text to audio")
    
    def process_voice_message(self, audio_data: str) -> str:
        """
        Process voice message and return transcribed text
        """
        return self.audio_to_text(audio_data)
    
    def generate_voice_response(self, text: str) -> str:
        """
        Generate voice response from text
        """
        return self.text_to_audio(text) 