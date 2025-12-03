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
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const selfName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Invitado"),
    [user]
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [numParticipants, setNumParticipants] = useState(1);
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>({});

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

  // WebRTC + Sockets
  useEffect(() => {
    initWebRTC();

    setOnPeerStream((peerId: string, stream: MediaStream) => {
      setPeerStreams((prev) => ({ ...prev, [peerId]: stream }));
      setParticipants((prev) => {
        const index = prev.findIndex((p) => p.id === peerId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            stream,
            videoEnabled: true,
            audioEnabled: true,
          };
          return updated;
        }

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

    if (id) {
      getRoomCount(id);
      connectRoomSocket(id);
    }

    socket.on("room-count", (roomCount: roomCount) => {
      setNumParticipants(roomCount.uniqueUserCount + 1);
    });

    socket.on("new-message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);

      // ARIA Live region for screen readers
      const liveRegion = document.getElementById("sr-message-updates");
      if (liveRegion) {
        liveRegion.textContent = `Nuevo mensaje de ${msg.userName}: ${msg.content}`;
      }

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

  const toggleAudio = () => {
    isAudioEnabled ? disableOutgoingStream() : enableOutgoingStream();
    setIsAudioEnabled(!isAudioEnabled);
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, audioEnabled: !isAudioEnabled } : p))
    );
  };

  const toggleVideo = () => {
    isVideoEnabled ? disableOutgoingVideo() : enableOutgoingVideo();
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
    <div className="h-screen flex flex-col bg-gray-900" role="main" aria-label="Sala de videollamada">

      {/* Región ARIA para mensajes nuevos */}
      <div
        id="sr-message-updates"
        aria-live="polite"
        className="sr-only"
      ></div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700"
        role="banner"
      >
      <div>
          <h1 className="text-white">Sala de Reunión</h1>

      {/* ID copiable */}
      <p
        className="text-sm text-gray-300 cursor-pointer hover:text-white transition"
        aria-label={`ID de reunión: ${id}`}
        onClick={() => {
        navigator.clipboard.writeText(id || "");
        toast.success("ID copiado al portapapeles");
        }}
          title="Haz clic para copiar el ID"
        >
          ID: {id}
      </p>
      <p
        className="text-xs text-gray-400 mt-1"
        aria-label={`Hay ${numParticipants} participantes`}
      >
        {numParticipants} {numParticipants === 1 ? "participante" : "participantes"}
          </p>
      </div>


        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => {
              navigator.clipboard.writeText(id || "");
              toast.success("ID copiado al portapapeles");
            }}
            aria-label="Copiar ID de la reunión al portapapeles"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
          >
            Copiar ID
          </button> */}

          <span className="text-sm text-gray-400">Reunión en curso</span>

          {/* Indicador accesible */}
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
            aria-hidden="true"
          ></div>
          <span className="sr-only">La reunión está activa</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        <div className="flex-1 p-4" aria-label="Rejilla de video">
          <VideoGrid participants={participantsWithStreams} />
        </div>

        {showChat && (
          <div role="complementary" aria-label="Panel de chat">
            <ChatPanel messages={chatMessages} onClose={toggleChat} />
          </div>
        )}

        {showParticipants && (
          <div role="complementary" aria-label="Lista de participantes">
            <ParticipantsList participants={participants} onClose={toggleParticipants} />
          </div>
        )}
      </div>

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
