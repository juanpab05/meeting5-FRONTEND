import { useState } from "react";
import React, { useEffect } from 'react';
import type { ChatMessage } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { X, Send } from "lucide-react";
import { socket , connectSocket, disconnectSocket } from '../../sockets/socketManager';


interface ChatPanelProps {
  messages: ChatMessage[];
  onClose: () => void;
}

export function ChatPanel({
  messages,
  onClose,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const userData = localStorage.getItem("user");
  if (!userData){
    throw new Error("User data not found in localStorage");
  }
  //console.log("User data in ChatPanel:", userData);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: "",
      meetingId: "",
      userId: "",
      userName: "",
      content: input,
      timestamp: new Date(),
    }
    socket.emit("send-message", newMsg);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm mt-2">Sé el primero en enviar un mensaje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white">
                    {message.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(new Date(message.timestamp))}
                  </span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-200">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-gray-700 border-gray-600 text-black placeholder:text-gray-400"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>

        </div>
      </div>
    </div>
  );
}