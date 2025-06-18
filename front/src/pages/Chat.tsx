import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import FooterLogo from "../assets/img/logo.png";
import TextGenerateEffect from "../components/TextGenerate";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioPlayer from "../components/AudioPlayer";
import { wsClient } from "../lib/api";
import { Message, WebSocketMessage } from "../lib/types";

interface SuggestedQuestion {
  icon: string;
  title: string;
  description: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = 1; // TODO: Replace with actual user ID from auth

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      icon: "🎯",
      title: "Best spots on Dust2",
      description: "Learn about the most advantageous positions on Dust2 map",
    },
    {
      icon: "🔫",
      title: "Weapon spray patterns",
      description: "Master the recoil control of different weapons",
    },
    {
      icon: "💨",
      title: "Smoke lineups",
      description: "Essential smoke grenade lineups for competitive play",
    },
    {
      icon: "⚡",
      title: "Quick tips",
      description: "Fast tips to improve your gameplay immediately",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await wsClient.connect(userId);
        setIsConnected(true);

        // Set up message handler
        wsClient.onMessage(handleWebSocketMessage);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      wsClient.disconnect();
    };
  }, [userId]);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "text_response":
        const textMessage: Message = {
          role: "assistant",
          content: message.content,
          type: "text",
        };
        setMessages((prev) => [...prev, textMessage]);
        setIsLoading(false);
        break;

      case "voice_response":
        const voiceMessage: Message = {
          role: "assistant",
          content: message.text_content || message.content,
          type: "voice",
          audioData: message.audio_data,
        };
        setMessages((prev) => [...prev, voiceMessage]);
        setIsLoading(false);
        break;

      case "transcribed_text":
        const transcribedMessage: Message = {
          role: "user",
          content: message.content,
          type: "voice",
        };
        setMessages((prev) => [...prev, transcribedMessage]);
        break;

      case "error":
        const errorMessage: Message = {
          role: "assistant",
          content: message.content,
          type: "text",
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (isConnected) {
        // Send message via WebSocket
        wsClient.sendMessage({
          type: "text",
          content: userMessage.content,
          user_id: userId,
        });
      } else {
        // Fallback to REST API when WebSocket is not connected
        const response = await fetch("http://localhost:8000/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: userMessage.content,
            user_id: userId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          type: "text",
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble processing your request right now. Please check your connection.",
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
    if (!isConnected) return;

    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      setIsLoading(true);

      // Send voice message via WebSocket
      wsClient.sendMessage({
        type: "voice",
        content: "",
        user_id: userId,
        audio_data: base64Audio,
      });
    } catch (error) {
      console.error("Error processing voice recording:", error);
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: SuggestedQuestion) => {
    setInputMessage(question.title);
  };

  return (
    <div className="flex flex-col min-h-[90vh] bg-[#090D13] items-center font-poppins">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center max-w-3xl w-full px-4 mt-16 mb-16">
          <TextGenerateEffect
            wordClassName="font-jersey text-2xl md:text-4xl lg:text-6xl font-bold mx-auto text-center mb-14"
            words="Ask about the best tactics from our AI-Strike mentor"
            wordsCallbackClass={({ word }) => {
              if (word === "AI-Strike") {
                return "bg-gradient-to-r from-[#FF9B01] to-[#D36611] bg-clip-text text-transparent";
              }
              return "";
            }}
          />
          <p className="text-gray-400 mb-8 text-lg text-center font-poppins">
            Talk freely and our AI will tell you the best spots to achieve your
            aim
          </p>

          {/* Connection status */}
          <div className="mb-4 flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Search input */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-white bg-opacity-10 text-white rounded-full px-6 py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-primary-orange font-poppins placeholder-gray-500 text-lg"
                disabled={isLoading}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🎯
              </span>

              {/* Voice recorder */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecordingComplete}
                  isRecording={isRecording}
                  onStartRecording={() => setIsRecording(true)}
                  onStopRecording={() => setIsRecording(false)}
                />
              </div>

              {/* Text submit button */}
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-orange text-white rounded-full p-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isConnected
                    ? "WebSocket disconnected - using REST API fallback"
                    : "Send message"
                }
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Suggested questions */}
          <div className="text-gray-400 mb-4 font-poppins text-center">
            You may ask
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="bg-white bg-opacity-5 rounded-lg p-4 text-left hover:bg-opacity-10 transition-all duration-200 font-poppins"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{question.icon}</span>
                  <div>
                    <div className="text-white font-jersey text-lg mb-1">
                      {question.title}
                    </div>
                    <div className="text-gray-400 text-sm font-poppins">
                      {question.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <div className="flex-1 w-full max-w-3xl overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 font-poppins text-base ${
                    message.role === "user"
                      ? "bg-primary-orange text-white font-bold"
                      : "bg-white bg-opacity-10 text-white"
                  }`}
                >
                  <div className="mb-2">{message.content}</div>

                  {/* Audio player for voice messages */}
                  {message.role === "assistant" &&
                    message.type === "voice" &&
                    message.audioData && (
                      <AudioPlayer
                        audioData={message.audioData}
                        autoPlay={true}
                      />
                    )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white bg-opacity-10 text-white rounded-lg p-3 font-poppins">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl border-t border-gray-800 p-4"
          >
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-white bg-opacity-10 text-white rounded-full px-6 py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-primary-orange font-poppins placeholder-gray-300 text-lg"
                disabled={isLoading}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🎯
              </span>

              {/* Voice recorder */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecordingComplete}
                  isRecording={isRecording}
                  onStartRecording={() => setIsRecording(true)}
                  onStopRecording={() => setIsRecording(false)}
                />
              </div>

              {/* Text submit button */}
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-orange text-white rounded-full p-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isConnected
                    ? "WebSocket disconnected - using REST API fallback"
                    : "Send message"
                }
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </>
      )}

      {/* Footer */}
      {messages.length === 0 && (
        <footer className="bg-black text-white py-10 px-4 w-full mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <img
                src={FooterLogo}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="font-bold text-lg"></span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Strike Mentor. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Chat;
