import { useState, useEffect } from "react";
import React from "react";
import type { ChatMessage } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { X, Send } from "lucide-react";
import { socket } from "../../sockets/socketManager";

interface ChatPanelProps {
  messages: ChatMessage[];
  onClose: () => void;
}

export function ChatPanel({ messages, onClose }: ChatPanelProps) {
  const [userName, setUserName] = useState("");
  const [input, setInput] = useState("");

  const userData = localStorage.getItem("user");
  const parsedData = userData ? JSON.parse(userData) : null;

  // Si el usuario no existe → evitar error fatal
  useEffect(() => {
    if (parsedData) {
      setUserName(`${parsedData.firstName} ${parsedData.lastName}`);
    }
  }, [parsedData]);

  // Si no hay usuario, mostramos un mensaje seguro
  if (!parsedData) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 text-white">
        <p>No se pudo cargar la información del usuario.</p>
        <Button
          onClick={onClose}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Cerrar
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      meetingId: parsedData.currentMeetingId || "",
      userId: parsedData.id,
      userName,
      content: input,
      timestamp: new Date(),
    };

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
    <aside
      aria-label="Panel de chat"
      className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Chat</h3>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Cerrar chat"
          onClick={onClose}
          className="text-gray-400 hover:text-white focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea
        className="flex-1 p-4 overflow-y-auto"
        id="chat-container"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm mt-2">Sé el primero en enviar un mensaje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.userId === parsedData.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[75%] space-y-1">
                    <div className="flex items-baseline gap-2">
                      {!isOwn && (
                        <span className="text-sm text-white">
                          {message.userName}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(new Date(message.timestamp))}
                      </span>
                    </div>

                    <div
                      className={`rounded-lg p-3 text-sm ${
                        isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            aria-label="Escribe un mensaje"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-gray-700 border-gray-600 text-black placeholder:text-gray-400
                       focus:ring-2 focus:ring-blue-500"
          />

          <Button
            onClick={handleSend}
            size="icon"
            aria-label="Enviar mensaje"
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 flex items-center justify-center
                       focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
