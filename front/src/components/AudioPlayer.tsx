import React, { useState, useRef, useCallback } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

interface AudioPlayerProps {
  audioData: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioData,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async () => {
    try {
      setIsLoading(true);

      // Convert base64 to blob
      const audioBytes = atob(audioData);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onplay = () => {
        setIsPlaying(true);
        onPlay?.();
      };
      audio.onpause = () => {
        setIsPlaying(false);
        onPause?.();
      };
      audio.onended = () => {
        setIsPlaying(false);
        onEnded?.();
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
    }
  }, [audioData, onPlay, onPause, onEnded]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Auto-play when audioData changes
  React.useEffect(() => {
    if (autoPlay && audioData) {
      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioData, autoPlay, playAudio]);

  if (!audioData) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {!isPlaying ? (
        <button
          onClick={playAudio}
          disabled={isLoading}
          className="bg-primary-orange hover:bg-opacity-90 text-white rounded-full p-2 transition-colors duration-200 disabled:opacity-50"
          title="Play audio"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
      ) : (
        <button
          onClick={pauseAudio}
          className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-2 transition-colors duration-200"
          title="Pause audio"
        >
          <PauseIcon className="h-5 w-5" />
        </button>
      )}

      <div className="flex items-center space-x-1">
        <SpeakerWaveIcon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">Voice Response</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
