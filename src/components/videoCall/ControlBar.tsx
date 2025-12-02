import { Button } from "../ui/button";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, PhoneOff } from "lucide-react";
import { Badge } from "../ui/badge";

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  showChat: boolean;
  showParticipants: boolean;
  unreadMessages: number;
  participantCount: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onLeaveCall: () => void;
}

export function ControlBar({
  isAudioEnabled,
  isVideoEnabled,
  showChat,
  showParticipants,
  unreadMessages,
  participantCount,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onToggleParticipants,
  onLeaveCall,
}: ControlBarProps) {
  return (
    <div
      className="bg-gray-800 border-t border-gray-700 px-6 py-4"
      role="toolbar"
      aria-label="Controles de llamada"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">

        {/* Centro: mic, video, salir */}
        <div className="flex justify-center gap-2 flex-1">

          {/* Micrófono */}
          <Button
            variant={isAudioEnabled ? "circleBlue" : "circleRed"}
            size="circle"
            onClick={onToggleAudio}
            aria-label={isAudioEnabled ? "Desactivar micrófono" : "Activar micrófono"}
            aria-pressed={isAudioEnabled}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {/* Cámara */}
          <Button
            variant={isVideoEnabled ? "circleBlue" : "circleRed"}
            size="circle"
            onClick={onToggleVideo}
            aria-label={isVideoEnabled ? "Desactivar cámara" : "Activar cámara"}
            aria-pressed={isVideoEnabled}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          {/* Salir */}
          <Button
            variant="pillRed"
            size="pill"
            onClick={onLeaveCall}
            aria-label="Salir de la llamada"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="sr-only">Salir</span>
          </Button>
        </div>

        {/* Derecha: chat y participantes */}
        <div className="flex items-center gap-2">

          {/* Chat */}
          <div className="relative">
            <Button
              variant={showChat ? "circleBlue" : "secondary"}
              size="circle"
              onClick={onToggleChat}
              aria-label={showChat ? "Cerrar chat" : "Abrir chat"}
              aria-pressed={showChat}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </Button>

            {unreadMessages > 0 && !showChat && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                aria-label={`${unreadMessages} mensajes sin leer`}
              >
                {unreadMessages}
              </Badge>
            )}
          </div>

          {/* Participantes */}
          <div className="relative">
            <Button
              variant={showParticipants ? "circleBlue" : "secondary"}
              size="circle"
              onClick={onToggleParticipants}
              aria-label={showParticipants ? "Cerrar lista de participantes" : "Abrir lista de participantes"}
              aria-pressed={showParticipants}
            >
              <Users className="w-5 h-5 text-white" />
            </Button>

            {participantCount > 1 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                aria-label={`${participantCount} participantes en la llamada`}
              >
                {participantCount}
              </Badge>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
