import type { Participant } from "../../types";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface VideoTileProps {
  participant: Participant;
  compact?: boolean;
}

export function VideoTile({ participant, compact = false }: VideoTileProps) {
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
    <div className="relative bg-gray-800 rounded-lg overflow-hidden group h-full">
      {/* Video or Avatar */}
      {participant.videoEnabled ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          {/* Simulación de video */}
          <div className="text-center">
            <Video className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Cámara activa</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Avatar className={compact ? "w-16 h-16" : "w-24 h-24"}>
            <AvatarFallback className={getRandomColor(participant.id)}>
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Participant Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{participant.name}</span>
            {participant.isLocal && (
              <span className="text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
                Tú
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {participant.audioEnabled ? (
              <Mic className="w-4 h-4" style={{ color: '#22C55E' }} />
            ) : (
              <MicOff className="w-4 h-4" style={{ color: '#EF4444' }} />
            )}
          </div>
        </div>
      </div>

      {/* Border for active speaker (simulated) */}
      {participant.audioEnabled && (
        <div className="absolute inset-0 border-2 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: '#22C55E' }}></div>
      )}
    </div>
  );
}