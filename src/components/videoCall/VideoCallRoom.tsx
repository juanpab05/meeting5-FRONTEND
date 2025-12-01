// components/videoCall/VideoCallRoom.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoGrid } from "./VideoGrid";
import { ControlBar } from "./ControlBar";
import { ChatPanel } from "./ChatPanel";
import { ParticipantsList } from "./ParticipantsList";
import { useUser } from "../../context/UserContext";
import { socket, connectRoomSocket, getRoomCount } from "../../sockets/socketManager";
import {
  initWebRTC,
  setOnPeerStream,
  setOnPeerConnected,
  setOnPeerDisconnected,
  disableOutgoingStream,
  enableOutgoingStream,
  disableOutgoingVideo,
  enableOutgoingVideo,
  localMediaStream,
  getSelfSocketId,
  closeAllPeers,
  stopLocalMedia,
} from "../../webrtc/webrtc";
import type { Participant, ChatMessage, roomCount, VideoCallRoomProps } from "../../types";
import { toast } from "sonner";

interface ParticipantWithStream extends Participant {
  stream?: MediaStream;
}

export function VideoCallRoom({ onLeave }: VideoCallRoomProps = {}) {
  const { id } = useParams(); // meetingId desde la URL
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  if (!userData) {
    throw new Error("User data not found in localStorage");
  }
  const parsedData = JSON.parse(userData);
  const { user } = useUser();

  const selfName =  `${parsedData.firstName} ${parsedData.lastName}`

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [numParticipants, setNumParticipants] = useState(1);
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>({});

  // Estado de participantes (local + remotos)
  const [participants, setParticipants] = useState<ParticipantWithStream[]>(() => {
    const selfId = user?._id || getSelfSocketId() || "local";
    return [
      {
        id: selfId,
        name: selfName,
        isLocal: true,
        audioEnabled: true,
        videoEnabled: true,
        stream: localMediaStream || undefined,
      },
    ];
  });

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Inicialización de WebRTC y Signaling
  useEffect(() => {
    initWebRTC();

    setOnPeerStream((peerId: string, stream: MediaStream) => {
      setPeerStreams((prev) => ({ ...prev, [peerId]: stream }));
      setParticipants((prev) => {
        const index = prev.findIndex((p) => p.id === peerId);
        if (index !== -1) {
          // Actualizar el participante existente con el stream
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            stream,
            videoEnabled: true,
            audioEnabled: true,
          };
          return updated;
        }
        // Agregar nuevo participante
        return [
          ...prev,
          {
            id: peerId,
            name: `Usuario ${peerId.slice(0, 5)}`,
            isLocal: false,
            audioEnabled: true,
            videoEnabled: true,
            stream,
          },
        ];
      });
      
    });

    // Conexión/desconexión de peers (sin stream aún)
    setOnPeerConnected((peerId: string) => {
      console.log(`[peer ${peerId}] conectado`);
    });

    setOnPeerDisconnected((peerId: string) => {
      setParticipants((prev) => prev.filter((p) => p.id !== peerId));
      setPeerStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    // Conexión al socket de la sala (chat/conteo)
    if (id) {
      getRoomCount(id);
      connectRoomSocket(id);
    }

    socket.on("room-count", (roomCount: roomCount) => {
      setNumParticipants(roomCount.uniqueUserCount + 1); // +1 local user
    });
    socket.on("new-message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
      if (!showChat) setUnreadMessages((u) => u + 1);
    });
    socket.on("error", (errorMessage: { message: string }) => {
      console.error("Socket error:", errorMessage);
      if (errorMessage.message === "Access denied to this meeting") {
        toast.error("Acceso denegado a esta reunión");
        handleLeave();
      } else if (errorMessage.message === "User already connected from another session") {
        toast.error("El usuario ya está conectado a la reunión desde otra página");
        handleLeave();
      }
    });

    return () => {
      socket.off("error");
      socket.off("room-count");
      socket.off("new-message");
    };
  }, [id]);

  // Toggles de audio/video
  const toggleAudio = () => {
    if (isAudioEnabled) {
      disableOutgoingStream();
    } else {
      enableOutgoingStream();
    }
    setIsAudioEnabled(!isAudioEnabled);
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, audioEnabled: !isAudioEnabled } : p))
    );
  };

  const toggleVideo = () => {
    if (isVideoEnabled) {
      disableOutgoingVideo();
    } else {
      enableOutgoingVideo();
    }
    setIsVideoEnabled(!isVideoEnabled);
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, videoEnabled: !isVideoEnabled } : p))
    );
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) setUnreadMessages(0);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  // Salir de la llamada (cleanup)
  const handleLeave = () => {
    try {
      closeAllPeers();
      stopLocalMedia();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
    if (onLeave) {
      onLeave();
    } else {
      socket.emit("leave-room");
      navigate("/create-meet");
    }
  };

  // Inyectar streams reales
  const uniqueParticipants = participants.reduce((acc, curr) => {
    if (!acc.some((p) => p.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, [] as ParticipantWithStream[]);

  const participantsWithStreams = uniqueParticipants.map((p) => ({
    ...p,
    stream: p.isLocal ? localMediaStream || undefined : peerStreams[p.id] || p.stream,
  }));

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h1 className="text-white">Sala de Reunión</h1>
          <p className="text-sm text-gray-400">
            ID: {id} • {numParticipants} {numParticipants === 1 ? "participante" : "participantes"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(id || "");
              toast.success("ID copiado al portapapeles");
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
          >
            Copiar ID
          </button>
          <span className="text-sm text-gray-400">Reunión en curso</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <VideoGrid participants={participantsWithStreams} />
        </div>

        {/* Chat Panel */}
        {showChat && <ChatPanel messages={chatMessages} onClose={toggleChat} />}

        {/* Participants Panel */}
        {showParticipants && (
          <ParticipantsList participants={participants} onClose={toggleParticipants} />
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        showChat={showChat}
        showParticipants={showParticipants}
        unreadMessages={unreadMessages}
        participantCount={participants.length}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={toggleChat}
        onToggleParticipants={toggleParticipants}
        onLeaveCall={handleLeave}
      />
    </div>
  );
}
