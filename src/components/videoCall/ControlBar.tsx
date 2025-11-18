import { Button } from "../ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  PhoneOff,
  Settings,
  MoreVertical,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  showChat: boolean;
  showParticipants: boolean;
  unreadMessages: number;
  participantCount: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onLeaveCall: () => void;
}

export function ControlBar({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  showChat,
  showParticipants,
  unreadMessages,
  participantCount,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onLeaveCall,
}: ControlBarProps) {
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={isAudioEnabled ? "circleBlue" : "circleRed"}
            size="circle"
            onClick={onToggleAudio}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "circleBlue" : "circleRed"}
            size="circle"
            onClick={onToggleVideo}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant={showChat ? "circleBlue" : "secondary"}
              size="circle"
              onClick={onToggleChat}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            {unreadMessages > 0 && !showChat && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessages}
              </Badge>
            )}
          </div>

          <div className="relative">
            <Button
              variant={showParticipants ? "circleBlue" : "secondary"}
              size="circle"
              onClick={onToggleParticipants}
            >
              <Users className="w-5 h-5" />
            </Button>
            {participantCount > 1 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
              >
                {participantCount}
              </Badge>
            )}
          </div>

          <Button variant="circleBlue" size="circle">
            <Settings className="w-5 h-5" />
          </Button>

          <Button variant="circleBlue" size="circle">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Controls */}
        <div>
          <Button
            variant="pillRed"
            size="pill"
            onClick={onLeaveCall}
          >
            <PhoneOff className="w-5 h-5" />
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
}
