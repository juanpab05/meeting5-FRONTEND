// webrtc/webrtc.ts
import Peer from "simple-peer/simplepeer.min.js";
import io from "socket.io-client";

const serverWebRTCUrl = import.meta.env.VITE_WEBRTC_URL;
const iceServerUrl = import.meta.env.VITE_ICE_SERVER_URL;
const iceServerUsername = import.meta.env.VITE_ICE_SERVER_USERNAME;
const iceServerCredential = import.meta.env.VITE_ICE_SERVER_CREDENTIAL;

type PeerEntry = {
  peerConnection: Peer.Instance;
};

let socket: ReturnType<typeof io> | null = null;
let peers: Record<string, PeerEntry> = {};



function getNameFromLocalStorage(): string | null {
  try {
     const userData = localStorage.getItem("user");
     const parsedData = userData ? JSON.parse(userData) : null;
     return parsedData ? `${parsedData.firstName} ${parsedData.lastName}` : null;
  } catch {
     return null;
  }
}

// 1. Agrega esta función exportada para poder llamarla desde React
export function sendUserToSignal(name: string) {
  if (socket && socket.connected) {
    socket.emit("setName", name);
    console.log("[Signal] Name sent manually:", name);
  } else {
    // Si el socket aún no conecta, guardamos el nombre temporalmente
    // para enviarlo apenas conecte (ver modificación en initSocketConnection)
    tempName = name; 
  }
}

export let localMediaStream: MediaStream | null = null;
let isInitializing = false;
let tempName: string | null = null;
let onPeerStream: ((peerId: string, stream: MediaStream) => void) | null = null;
let onPeerConnected: ((peerId: string) => void) | null = null;
let onPeerDisconnected: ((peerId: string) => void) | null = null;

export function setOnPeerStream(cb: (peerId: string, stream: MediaStream) => void) {
  onPeerStream = cb;
}

export function setOnPeerConnected(cb: (peerId: string) => void) {
  onPeerConnected = cb;
}

export function setOnPeerDisconnected(cb: (peerId: string) => void) {
  onPeerDisconnected = cb;
}

export function getSelfSocketId(): string | null {
  return socket?.id ?? null;
}

/**
 * Inicializa WebRTC: captura media local y conecta al servidor de señalización.
 */
export async function initWebRTC() {
  // 1. Prevención de doble ejecución
  if (isInitializing || (socket && socket.connected)) {
    console.log("[WebRTC] Ya inicializado o conectando...");
    return;
  }
  
  isInitializing = true; // Bloqueamos nuevas llamadas

  if (!Peer.WEBRTC_SUPPORT) {
    console.warn("WebRTC is not supported in this browser.");
    isInitializing = false;
    return;
  }

  try {
    // Si ya tenemos stream local (por una navegación anterior SPA), no lo pedimos de nuevo
    if (!localMediaStream) {
      localMediaStream = await getMedia();
    }

    console.log("[WebRTC] local tracks:", {
      audio: localMediaStream.getAudioTracks().length,
      video: localMediaStream.getVideoTracks().length,
    });
    
    initSocketConnection();
  } catch (error) {
    console.error("[WebRTC] Failed to initialize:", error);
  } finally {
    isInitializing = false; // Liberamos el bloqueo al terminar (éxito o error)
  }
}

/**
 * Obtiene el stream local con fallback a solo audio si el video falla.
 */
async function getMedia(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  } catch (err) {
    console.error("[WebRTC] Failed audio+video, retry audio:", err);
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }
}

// ... imports y configuración igual

let onPeerNameUpdated: ((peerId: string, name: string) => void) | null = null;
export function setOnPeerNameUpdated(cb: (peerId: string, name: string) => void) {
  onPeerNameUpdated = cb;
}

function initSocketConnection() {
  if (socket) return; 
  socket = io(serverWebRTCUrl);
  let hasSentName = false;

  socket.on("connect", () => {
    console.log("[Signal] connected with id:", socket?.id);
  
    if (!hasSentName) {
      // PRIORIDAD: Si React ya nos pasó un nombre, usamos ese.
      // Si no, intentamos localStorage como fallback.
      const nameToSend = tempName || getNameFromLocalStorage();
      
      if (nameToSend) {
        socket?.emit("setName", nameToSend);
        hasSentName = true;
      }
    }
  });

  socket.on("introduction", handleIntroduction);
  socket.on("newUserConnected", handleNewUserConnected);
  socket.on("userNameUpdated", handleUserNameUpdated);
  socket.on("userDisconnected", handleUserDisconnected);
  socket.on("signal", handleSignal);
}

function handleIntroduction(peersInfo: [string, { name: string | null }][]) {
  peersInfo.forEach(([theirId, info]) => {
    if (!socket || theirId === socket.id) return;
    if (peers[theirId]?.peerConnection && !peers[theirId].peerConnection.destroyed) return;

    const peerConnection = createPeerConnection(theirId, true);
    peers[theirId] = { peerConnection };
    onPeerConnected?.(theirId);

    onPeerNameUpdated?.(theirId, info.name ?? `Usuario ${theirId.slice(0, 5)}`);
  });
}

function handleNewUserConnected({ id, name }: { id: string; name: string | null }) {
  if (!socket || id === socket.id) return;
  if (peers[id]?.peerConnection && !peers[id].peerConnection.destroyed) return;

  const peerConnection = createPeerConnection(id, false);
  peers[id] = { peerConnection };
  onPeerConnected?.(id);

  onPeerNameUpdated?.(id, name ?? `Usuario ${id.slice(0, 5)}`);
}

function handleUserNameUpdated({ id, name }: { id: string; name: string }) {
  onPeerNameUpdated?.(id, name);
}

/**
 * Limpieza cuando un usuario se desconecta.
 */
function handleUserDisconnected(peerId: string) {
  if (!socket) return;
  if (peerId === socket.id) return;

  const entry = peers[peerId];
  try {
    entry?.peerConnection?.destroy();
  } catch {}
  delete peers[peerId];
  onPeerDisconnected?.(peerId);
}

/**
 * Relé de señal del servidor. Aplicamos al peer correspondiente.
 */
// webrtc/webrtc.ts (pequeña mejora en handleSignal)
function handleSignal(to: string, from: string, data: Peer.SignalData) {
  if (!socket || to !== socket.id) return;

  let entry = peers[from];
  if (!entry || !entry.peerConnection || entry.peerConnection.destroyed) {
    // Crear sólo si realmente no existe
    const peerConnection = createPeerConnection(from, false);
    peers[from] = { peerConnection };
    onPeerConnected?.(from);
  }

  // Aplicar señal sobre el peer existente
  peers[from].peerConnection.signal(data);
}


/**
 * Crea un peer connection con configuración de ICE servers.
 */
function createPeerConnection(theirSocketId: string, initiator = false): Peer.Instance {
  const iceServers: RTCIceServer[] = [];

  if (iceServerUrl) {
    const urls = iceServerUrl
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => (!/^stun:|^turn:|^turns:/.test(url) ? `turn:${url}` : url));

    urls.forEach((url) => {
      const serverConfig: any = { urls: url };
      if (iceServerUsername) serverConfig.username = iceServerUsername;
      if (iceServerCredential) serverConfig.credential = iceServerCredential;
      iceServers.push(serverConfig);
    });
  }

  const hasTurn = iceServers.some((server) => {
    const list = Array.isArray(server.urls) ? server.urls : [server.urls];
    return list.some((u) => typeof u === "string" && (u.startsWith("turn:") || u.startsWith("turns:")));
  });

  if (!iceServers.length || !hasTurn) {
    iceServers.push({ urls: "stun:stun.l.google.com:19302" });
  }

  const peerConnection = new Peer({
    initiator,
    trickle: true, // permitir ICE trickle para tiempos de conexión más rápidos
    config: { iceServers },
  });

  // Añadir tracks locales
  if (localMediaStream) {
    localMediaStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localMediaStream!);
    });
  }

  // Emitir señales al servidor de señalización
  peerConnection.on("signal", (data: Peer.SignalData) => {
    socket?.emit("signal", theirSocketId, socket.id, data);
  });

  // Conectado (datachannel abierto)
  peerConnection.on("connect", () => {
    console.log(`[peer ${theirSocketId}] connected`);
  });

  // Recibir stream remoto
  peerConnection.on("stream", (stream: MediaStream) => {
    onPeerStream?.(theirSocketId, stream);
  });

  // Limpieza por cierre/error
  peerConnection.on("close", () => {
    console.log(`[peer ${theirSocketId}] closed`);
  });
  peerConnection.on("error", (err) => {
    console.error(`[peer ${theirSocketId}] error:`, err);
  });

  return peerConnection;
}

/**
 * Mute/unmute de audio por track.enabled (estable).
 */
export function disableOutgoingStream() {
  if (!localMediaStream) return;
  const audioTracks = localMediaStream.getAudioTracks();
  if (!audioTracks.length) {
    console.warn("[mute] no audio tracks found");
    return;
  }
  audioTracks.forEach((track) => (track.enabled = false));
  console.log("[mute] audio tracks disabled:", audioTracks.length);
}

export function enableOutgoingStream() {
  if (!localMediaStream) return;
  const audioTracks = localMediaStream.getAudioTracks();
  if (!audioTracks.length) {
    console.warn("[unmute] no audio tracks found");
    return;
  }
  audioTracks.forEach((track) => (track.enabled = true));
  console.log("[unmute] audio tracks enabled:", audioTracks.length);
}

/**
 * Video on/off protegido (si hay video).
 */
export function disableOutgoingVideo() {
  if (!localMediaStream) return;
  const videoTracks = localMediaStream.getVideoTracks();
  if (!videoTracks.length) {
    console.warn("[video off] no video tracks found");
    return;
  }
  videoTracks.forEach((track) => (track.enabled = false));
  console.log("[video off] disabled:", videoTracks.length);
}

export function enableOutgoingVideo() {
  if (!localMediaStream) return;
  const videoTracks = localMediaStream.getVideoTracks();
  if (!videoTracks.length) {
    console.warn("[video on] no video tracks found");
    return;
  }
  videoTracks.forEach((track) => (track.enabled = true));
  console.log("[video on] enabled:", videoTracks.length);
}

/**
 * Cierra todo: peers y media local.
 */
export function closeAllPeers() {
  Object.values(peers).forEach(({ peerConnection }) => {
    try {
      peerConnection.destroy();
    } catch {}
  });
  peers = {};
}

export function stopLocalMedia() {
  localMediaStream?.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch {}
  });
  localMediaStream = null;
}
