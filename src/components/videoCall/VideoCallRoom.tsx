
import { useState, useEffect, useMemo, useRef } from "react"; // <--- 1. Importa useRef
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
  setOnPeerNameUpdated,
  sendUserToSignal,
  disableOutgoingStream,
  enableOutgoingStream,
  disableOutgoingVideo,
  enableOutgoingVideo,
  localMediaStream,
  getSelfSocketId,
  closeAllPeers,
  stopLocalMedia,
} from "../../webrtc/webrtc";
import type { Participant, ChatMessage, VideoCallRoomProps } from "../../types";
import { toast } from "sonner";

interface ParticipantWithStream extends Participant {
  stream?: MediaStream;
}

export function VideoCallRoom({ onLeave }: VideoCallRoomProps = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();


  const peerNamesRef = useRef<Record<string, string>>({});

  const selfName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Invitado"),
    [user]
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>({});

  const [participants, setParticipants] = useState<ParticipantWithStream[]>(() => {
    return [
      {
        id: "local",
        name: selfName,
        isLocal: true,
        audioEnabled: true,
        videoEnabled: true,
        stream: localMediaStream || undefined,
      },
    ];
  });
  const [selfId, setSelfId] = useState<string>("local");

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    let mounted = true;

    // Wait for the socket ID to be assigned before proceeding.
    // This ensures getSelfSocketId() is not null when we render.
    const checkReady = () => {
      const id = getSelfSocketId();
      if (id) {
        setSelfId(id);
        setIsReady(true);
      } else if (mounted) {
        // Keep polling until we get an ID (usually within a few hundred ms)
        const timer = setTimeout(checkReady, 100);
        return () => clearTimeout(timer);
      }
    };

    checkReady();

    setOnPeerStream((peerId: string, stream: MediaStream) => {
      if (!mounted) return;
      
      setPeerStreams((prev) => ({ ...prev, [peerId]: stream }));
      setParticipants((prev) => {
        const index = prev.findIndex((p) => p.id === peerId);
        
        if (index !== -1) {
          const updated = [...prev];

          updated[index] = { ...updated[index], stream, videoEnabled: true, audioEnabled: true }; 
          return updated;
        }
        
        const savedName = peerNamesRef.current[peerId];
        return [
          ...prev,
          {
            id: peerId,
            name: savedName || `Usuario ${peerId.slice(0, 5)}`,
            isLocal: false,
            audioEnabled: true,
            videoEnabled: true,
            stream,
          },
        ];
      });
    });

    setOnPeerNameUpdated((peerId: string, name: string) => {
      peerNamesRef.current[peerId] = name;

      setParticipants(prev =>
        prev.map(p =>
          p.id === peerId
            ? { ...p, name }
            : p
        )
      );
    });
    

    setOnPeerConnected((peerId: string) => {
      console.log(`[peer ${peerId}] conectado`);
    });

    setOnPeerDisconnected((peerId: string) => {
      delete peerNamesRef.current[peerId];
      
      setParticipants((prev) => prev.filter((p) => p.id !== peerId));
      setPeerStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    if (!localMediaStream) {
      initWebRTC();
  } else {

      sendUserToSignal(selfName);
  }

  sendUserToSignal(selfName);

    if (id) {
      getRoomCount(id);
      connectRoomSocket(id);
    }

    socket.on("new-message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
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

    // Listen for peers toggling audio/video so we reflect their state in UI.
    socket.on("new-av-status", ({ meetingId, peerId, audioEnabled, videoEnabled }: { meetingId: string, peerId: string; audioEnabled: boolean; videoEnabled: boolean }) => {
      console.log("Received peer AV state:", { peerId, audioEnabled, videoEnabled });
      if (!peerId) return;
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === peerId
            ? { ...p, audioEnabled, videoEnabled }
            : p
        )
      );
    });

    return () => {
      mounted = false;
      socket.off("error");
      socket.off("room-count");
      socket.off("new-message");
      socket.off("new-av-status");
    };
  }, [id, selfName]); // Dependencias


  const toggleAudio = () => {
    const next = !isAudioEnabled;
    isAudioEnabled ? disableOutgoingStream() : enableOutgoingStream();
    setIsAudioEnabled(next);
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, audioEnabled: next } : p))
    );
    // Broadcast new state to peers so they can render the muted icon.
    socket.emit("send-av-status", {
      meetingId: id,
      peerId: selfId,
      audioEnabled: next,
      videoEnabled: isVideoEnabled,
    });
  };

  const toggleVideo = () => {
    const next = !isVideoEnabled;
    isVideoEnabled ? disableOutgoingVideo() : enableOutgoingVideo();
    setIsVideoEnabled(next);
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, videoEnabled: next } : p))
    );
    // Broadcast new state to peers so they can render the camera-off icon.
    socket.emit("send-av-status", {
      meetingId: id,
      peerId: selfId,
      audioEnabled: isAudioEnabled,
      videoEnabled: next,
    });
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
      <div id="sr-message-updates" aria-live="polite" className="sr-only"></div>

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
        aria-label={`Hay ${participants.length} participantes`}
      >
        {participants.length} {participants.length === 1 ? "participante" : "participantes"}
          </p>
      </div>


        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => {
              navigator.clipboard.writeText(id || "");
              toast.success("ID copiado al portapapeles");
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
          >
            Copiar ID
          </button> */}

          <span className="text-sm text-gray-400">Reunión en curso</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4">
          <VideoGrid participants={participantsWithStreams} />
        </div>
        {showChat && (
          <div role="complementary">
            <ChatPanel messages={chatMessages} onClose={toggleChat} />
          </div>
        )}
        {showParticipants && (
          <div role="complementary">
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