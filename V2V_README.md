# V2V (Voice-to-Voice) Implementation

This document describes the implementation of a Voice-to-Voice (V2V) system with WebSocket support for the Strike Mentor application.

## Features

### 🎤 Voice Recording

- Real-time voice recording using the Web Audio API
- Support for WebM audio format with Opus codec
- Visual feedback during recording (pulsing red button)
- Automatic microphone permission handling

### 🔊 Voice Playback

- Automatic audio playback of AI responses
- Support for MP3 audio format
- Play/pause controls for voice messages
- Visual indicators for audio status

### 🔄 WebSocket Communication

- Real-time bidirectional communication
- Support for both text and voice messages
- Automatic reconnection handling
- Connection status indicators

### 🗣️ Speech Processing

- Speech-to-Text (STT) using Google Speech Recognition
- Text-to-Speech (TTS) using Google Text-to-Speech (gTTS)
- Support for multiple languages
- Error handling for speech processing failures

## Architecture

### Backend Components

#### 1. Voice Processor (`back/src/voice_processor.py`)

```python
class VoiceProcessor:
    - audio_to_text(audio_data: str) -> str
    - text_to_audio(text: str, language: str = "en") -> str
    - process_voice_message(audio_data: str) -> str
    - generate_voice_response(text: str) -> str
```

#### 2. WebSocket Manager (`back/src/main.py`)

```python
class ConnectionManager:
    - connect(websocket: WebSocket, user_id: int)
    - disconnect(websocket: WebSocket, user_id: int)
    - send_personal_message(message: str, user_id: int)
```

#### 3. API Endpoints

- `POST /voice-to-text/` - Convert voice to text
- `POST /text-to-voice/` - Convert text to voice
- `WebSocket /ws/{user_id}` - Real-time communication

### Frontend Components

#### 1. Voice Recorder (`front/src/components/VoiceRecorder.tsx`)

- Microphone button with recording state
- Web Audio API integration
- Visual feedback during recording

#### 2. Audio Player (`front/src/components/AudioPlayer.tsx`)

- Play/pause controls for audio responses
- Base64 audio data handling
- Auto-play functionality

#### 3. WebSocket Client (`front/src/lib/api.ts`)

```typescript
class WebSocketClient {
    - connect(userId: number): Promise<void>
    - disconnect(): void
    - sendMessage(message: WebSocketMessage): void
    - onMessage(handler: Function): void
}
```

## Message Flow

### Text Message Flow

1. User types message → Frontend sends via WebSocket
2. Backend processes with AI → Generates text response
3. Backend converts text to speech → Sends both text and audio
4. Frontend displays text and plays audio

### Voice Message Flow

1. User records voice → Frontend converts to base64
2. Frontend sends audio via WebSocket
3. Backend converts speech to text → Processes with AI
4. Backend converts response to speech → Sends transcribed text, response text, and audio
5. Frontend displays all messages and plays audio

## Installation & Setup

### Backend Dependencies

```bash
pip install -r back/requirements.txt
```

New dependencies added:

- `websockets>=11.0.0` - WebSocket support
- `python-multipart>=0.0.6` - File upload support
- `gTTS>=2.3.0` - Google Text-to-Speech
- `SpeechRecognition>=3.10.0` - Speech recognition
- `pydub>=0.25.1` - Audio processing
- `aiofiles>=23.0.0` - Async file operations

### Frontend Dependencies

```bash
cd front && npm install
```

New dependencies added:

- `react-record-webcam` - Voice recording
- `react-speech-recognition` - Speech recognition

## Usage

### Starting the Application

1. **Backend**:

```bash
cd back
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Frontend**:

```bash
cd front
npm run dev
```

### Using Voice Features

1. **Voice Recording**:

   - Click the microphone button (🎤) to start recording
   - Speak your question or message
   - Click the stop button (⏹️) to end recording
   - The system will automatically transcribe and process your voice

2. **Voice Playback**:

   - AI responses with voice will automatically play
   - Use the play/pause button to control audio playback
   - Visual indicators show audio status

3. **Connection Status**:
   - Green dot indicates WebSocket connection is active
   - Red dot indicates connection issues
   - Messages are disabled when disconnected

## Technical Details

### Audio Formats

- **Recording**: WebM with Opus codec (browser native)
- **Playback**: MP3 (gTTS output)
- **Processing**: WAV (intermediate format for speech recognition)

### WebSocket Message Types

```typescript
type WebSocketMessage = {
  type:
    | "text"
    | "voice"
    | "text_response"
    | "voice_response"
    | "transcribed_text"
    | "error";
  content: string;
  user_id: number;
  audio_data?: string;
  text_content?: string;
};
```

### Error Handling

- Microphone permission denied
- Speech recognition failures
- WebSocket connection issues
- Audio processing errors

## Security Considerations

1. **Audio Data**: Audio is transmitted as base64 strings over WebSocket
2. **User Authentication**: User ID is currently hardcoded (TODO: implement proper auth)
3. **Rate Limiting**: Consider implementing rate limiting for voice processing
4. **Privacy**: Voice data is processed by Google services

## Future Enhancements

1. **Voice Activity Detection**: Automatic recording start/stop
2. **Multiple Languages**: Support for different languages
3. **Voice Customization**: Different AI voices
4. **Offline Support**: Local speech processing
5. **Voice Commands**: Special voice commands for navigation
6. **Audio Quality**: Higher quality audio processing
7. **Real-time Transcription**: Live transcription display

## Troubleshooting

### Common Issues

1. **Microphone not working**:

   - Check browser permissions
   - Ensure HTTPS (required for microphone access)
   - Try refreshing the page

2. **WebSocket connection failed**:

   - Check if backend is running
   - Verify WebSocket URL in frontend
   - Check firewall settings

3. **Speech recognition errors**:

   - Ensure clear audio input
   - Check internet connection (Google Speech API)
   - Try speaking more slowly

4. **Audio playback issues**:
   - Check browser audio settings
   - Ensure audio files are properly encoded
   - Try different browsers

### Debug Mode

Enable debug logging by setting environment variables:

```bash
export LOG_LEVEL=DEBUG
```

## API Documentation

### WebSocket Endpoints

#### Connect to WebSocket

```
ws://localhost:8000/ws/{user_id}
```

#### Send Text Message

```json
{
  "type": "text",
  "content": "Your message here",
  "user_id": 1
}
```

#### Send Voice Message

```json
{
  "type": "voice",
  "content": "",
  "user_id": 1,
  "audio_data": "base64_encoded_audio"
}
```

### REST Endpoints

#### Voice to Text

```bash
POST /voice-to-text/
Content-Type: application/json

{
  "audio_data": "base64_encoded_audio",
  "user_id": 1
}
```

#### Text to Voice

```bash
POST /text-to-voice/
Content-Type: application/json

{
  "text": "Text to convert to speech"
}
```

## Contributing

When contributing to the V2V system:

1. Test voice recording in different browsers
2. Verify WebSocket connection stability
3. Check audio quality and processing speed
4. Ensure proper error handling
5. Update documentation for new features

## License

This V2V implementation is part of the Strike Mentor project and follows the same licensing terms.
