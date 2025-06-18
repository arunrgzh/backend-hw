/** A game character */
export interface Character {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

/** A game map */
export interface Map {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

/** Game author for credits */
export interface Author {
  id: string;
  name: string;
  role: string;
}

export interface CardData {
  id: string;
  title: string;
  imageUrl?: string;
  subtitle?: string;
  details?: string[];
  name: string;
  fileName: string;
  firstAppeared: string;
  team: string;
  modelKV: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "voice";
  audioData?: string;
}

export interface WebSocketMessage {
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
}

export interface VoiceRecorder {
  start: () => Promise<void>;
  stop: () => Promise<Blob>;
  isRecording: boolean;
}

export interface AudioPlayer {
  play: (audioData: string) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
}
