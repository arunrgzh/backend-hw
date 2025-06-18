import React, { useState, useRef, useCallback } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        onRecordingComplete(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      onStartRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please check microphone permissions.");
    }
  }, [onRecordingComplete, onStartRecording]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      onStopRecording();
    }
  }, [onStopRecording]);

  return (
    <div className="flex items-center space-x-2">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors duration-200"
          title="Start voice recording"
        >
          <MicrophoneIcon className="h-6 w-6" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-3 transition-colors duration-200 animate-pulse"
          title="Stop voice recording"
        >
          <StopIcon className="h-6 w-6" />
        </button>
      )}
      {isRecording && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Recording...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
