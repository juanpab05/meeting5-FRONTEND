import type { Participant } from "../../types";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { X, Mic, MicOff, Video, VideoOff, MoreVertical } from "lucide-react";

interface ParticipantsListProps {
  participants: Participant[];
  onClose: () => void;
}

export function ParticipantsList({
  participants,
  onClose,
}: ParticipantsListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <h3 className="text-white">Participantes</h3>
          <p className="text-sm text-gray-400">
            {participants.length}{" "}
            {participants.length === 1 ? "persona" : "personas"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Participants List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className={getRandomColor(participant.id)}>
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white truncate">
                    {participant.name}
                  </p>
                  {participant.isLocal && (
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                      Tú
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {participant.audioEnabled ? (
                    <Mic className="w-3 h-3" style={{ color: '#22C55E' }} />
                  ) : (
                    <MicOff className="w-3 h-3" style={{ color: '#EF4444' }} />
                  )}
                  {participant.videoEnabled ? (
                    <Video className="w-3 h-3" style={{ color: '#22C55E' }} />
                  ) : (
                    <VideoOff className="w-3 h-3" style={{ color: '#EF4444' }} />
                  )}
                </div>
              </div>
              {!participant.isLocal && (
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}