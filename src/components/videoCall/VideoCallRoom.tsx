import { useState } from "react";
import { useParams } from "react-router-dom";
import { VideoGrid } from "./VideoGrid";
import { ControlBar } from "./ControlBar";
import { ChatPanel } from "./ChatPanel";
import { ParticipantsList } from "./ParticipantsList";
import { useUser } from "../../context/UserContext"; 
import { useNavigate } from "react-router-dom";
import { socket, connectRoomSocket, getRoomCount} from "../../sockets/socketManager";
import { useEffect } from "react";

import type { Participant, ChatMessage, roomCount, VideoCallRoomProps } from "../../types";
import { toast } from "sonner";

export function VideoCallRoom({ onLeave }: VideoCallRoomProps = {}) {
  const { id } = useParams(); // meetingId desde la URL
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [numParticipants, setNumParticipants] = useState(1);

  useEffect(() => {
    if (id) {
      getRoomCount(id);
      connectRoomSocket(id);
    }
    socket.on("room-count", (roomCount: roomCount) => {
        //console.log(`Current participants in room ${id}: ${roomCount.userIds}`);
        setNumParticipants(roomCount.uniqueUserCount + 1); // +1 to account for local user
      });
    socket.on("new-message", (msg: ChatMessage) => {
        setChatMessages(prev => [...prev, msg]);
        //console.log('new-message listeners count', socket.listeners('new-message')?.length);
      });
    socket.on("error", (errorMessage: { message: string }) => {
        console.error("Socket error:", errorMessage);
        if (errorMessage.message === "Access denied to this meeting") {
          toast.error("Acceso denegado a esta reunión");
          handleLeave();
        } 
        else if (errorMessage.message === "User already connected from another session") {
          toast.error("El usuario ya esta conectado a la reunión desde otra página");
          handleLeave();
        }
      });
    return () => {
      socket.off('error');
      socket.off('room-count');
      socket.off('new-message');
    };
  }, [socket]);


  const navigate = useNavigate();

  const { user } = useUser(); 

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: user?._id || "local",
      name: user ? `${user.firstName} ${user.lastName}` : "Invitado",
      isLocal: true,
      audioEnabled: true,
      videoEnabled: true,
    },
  ]);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // 🔊 Toggle audio
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, audioEnabled: !isAudioEnabled } : p
      )
    );
  };

  // 🎥 Toggle video
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, videoEnabled: !isVideoEnabled } : p
      )
    );
  };

  // 🖥️ Toggle screen share
  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  // 💬 Toggle chat
  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setUnreadMessages(0);
    }
  };

  // 👥 Toggle participants panel
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };


  // 🚪 Leave call
  // Si no pasas onLeave desde las rutas, aquí puedes definir el comportamiento por defecto
  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    } else {
      socket.emit("leave-room")
      navigate("/create-meet"); // 👈 redirige al home al salir
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h1 className="text-white">Sala de Reunión</h1>
          <p className="text-sm text-gray-400">
            ID: {id} • {numParticipants}{" "}
            {numParticipants === 1 ? "participante" : "participantes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Reunión en curso</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <VideoGrid
            participants={participants}
            isScreenSharing={isScreenSharing}
          />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            messages={chatMessages}
            onClose={toggleChat}
          />
        )}

        {/* Participants Panel */}
        {showParticipants && (
          <ParticipantsList
            participants={participants}
            onClose={toggleParticipants}
          />
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        showChat={showChat}
        showParticipants={showParticipants}
        unreadMessages={unreadMessages}
        participantCount={participants.length}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={toggleChat}
        onToggleParticipants={toggleParticipants}
        onLeaveCall={handleLeave}
      />
    </div>
  );
}
