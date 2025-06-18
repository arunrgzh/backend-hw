import { Character, Map, WebSocketMessage } from "./types";

const API_BASE_URL = "http://localhost:8000";
const WS_BASE_URL = "ws://localhost:8000";

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  connect(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/${userId}`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(message));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }
}

export const wsClient = new WebSocketClient();

// REST API functions
export async function getCharacters(): Promise<Character[]> {
  const response = await fetch(`${API_BASE_URL}/get_characters/`);
  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }
  return response.json();
}

export async function addCharacter(
  character: Omit<Character, "id" | "created_at">
): Promise<Character> {
  const response = await fetch(`${API_BASE_URL}/add_characters/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  });
  if (!response.ok) {
    throw new Error("Failed to add character");
  }
  return response.json();
}

export async function sendChatMessage(
  content: string,
  userId: number
): Promise<{ response: string }> {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      user_id: userId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to send chat message");
  }
  return response.json();
}

export async function voiceToText(
  audioData: string,
  userId: number
): Promise<{ text: string }> {
  const response = await fetch(`${API_BASE_URL}/voice-to-text/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_data: audioData,
      user_id: userId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to convert voice to text");
  }
  return response.json();
}

export async function textToVoice(
  text: string
): Promise<{ audio_data: string }> {
  const response = await fetch(`${API_BASE_URL}/text-to-voice/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Failed to convert text to voice");
  }
  return response.json();
}
