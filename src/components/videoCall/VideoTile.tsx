import { useEffect, useRef } from "react";
import type { Participant } from "../../types";
import { Mic, MicOff, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface VideoTileProps {
  participant: Participant & { stream?: MediaStream };
  compact?: boolean;
}

export function VideoTile({ participant, compact = false }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

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

  const showVideo = participant.videoEnabled && participant.stream;

  return (
    <div
      className="relative bg-gray-800 rounded-lg overflow-hidden group h-full"
      role="group"
      aria-label={`Panel de video de ${participant.name}${participant.isLocal ? " (tú)" : ""}`}
    >
      {/* Video o Avatar */}
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          className="w-full h-full object-cover"
          aria-label={`Video en vivo de ${participant.name}`}
          title={`Video en vivo de ${participant.name}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Avatar
            role="img"
            aria-label={`Imagen de perfil de ${participant.name}`}
            className={compact ? "w-16 h-16" : "w-24 h-24"}
          >
            <AvatarFallback className={getRandomColor(participant.id)}>
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Overlay con info del participante */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{participant.name}</span>
            {participant.isLocal && (
              <span
                className="text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded"
                aria-label="Eres tú"
              >
                Tú
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {participant.audioEnabled ? (
              <Mic
                className="w-4 h-4"
                style={{ color: "#22C55E" }}
                aria-label="Micrófono encendido"
              >
                <title>Micrófono encendido</title>
              </Mic>
            ) : (
              <MicOff
                className="w-4 h-4"
                style={{ color: "#EF4444" }}
                aria-label="Micrófono apagado"
              >
                <title>Micrófono apagado</title>
              </MicOff>
            )}
            {!participant.videoEnabled && (
              <VideoOff
                className="w-4 h-4"
                style={{ color: "#EF4444" }}
                aria-label="Video apagado"
              >
                <title>Video apagado</title>
              </VideoOff>
            )}
          </div>
        </div>
      </div>

      {/* Active speaker highlight */}
      {participant.audioEnabled && (
        <div
          className="absolute inset-0 border-2 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: "#22C55E" }}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}
