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

export let localMediaStream: MediaStream | null = null;

// Callbacks que registra React
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
  if (!Peer.WEBRTC_SUPPORT) {
    console.warn("WebRTC is not supported in this browser.");
    return;
  }
  try {
    localMediaStream = await getMedia();
    console.log("[WebRTC] local tracks:", {
      audio: localMediaStream.getAudioTracks().length,
      video: localMediaStream.getVideoTracks().length,
    });
    initSocketConnection();
  } catch (error) {
    console.error("[WebRTC] Failed to initialize:", error);
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

/**
 * Conecta al servidor de señalización y registra listeners.
 */
function initSocketConnection() {
  socket = io(serverWebRTCUrl);

  socket.on("connect", () => {
    console.log("[Signal] connected with id:", socket?.id);
  });

  socket.on("introduction", handleIntroduction);
  socket.on("newUserConnected", handleNewUserConnected);
  socket.on("userDisconnected", handleUserDisconnected);
  socket.on("signal", handleSignal);
}

/**
 * Al conectar, el servidor envía la lista de IDs actuales.
 * Creamos peers como initiator hacia cada uno (excepto nosotros).
 */
function handleIntroduction(otherClientIds: string[]) {
  otherClientIds.forEach((theirId) => {
    if (!socket) return;
    if (theirId === socket.id) return;
    if (peers[theirId]?.peerConnection && !peers[theirId].peerConnection.destroyed) return;

    const peerConnection = createPeerConnection(theirId, true);
    peers[theirId] = { peerConnection };
    onPeerConnected?.(theirId);
  });
}

/**
 * Cuando llega un nuevo usuario, preparamos el registro para él.
 * No iniciamos la conexión hasta que recibimos su señal o decidimos iniciar.
 */
function handleNewUserConnected(theirId: string) {
  if (!socket) return;
  if (theirId === socket.id) return;
  if (peers[theirId]?.peerConnection && !peers[theirId].peerConnection.destroyed) return;

  // Creamos la conexión como NO initiator, esperaremos su señal o emitiremos al recibir señal
  const peerConnection = createPeerConnection(theirId, false);
  peers[theirId] = { peerConnection };
  onPeerConnected?.(theirId);
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
function handleSignal(to: string, from: string, data: Peer.SignalData) {
  if (!socket) return;
  if (to !== socket.id) return;

  let entry = peers[from];
  if (entry && entry.peerConnection && !entry.peerConnection.destroyed) {
    entry.peerConnection.signal(data);
  } else {
    // Si no existía, creamos como non-initiator y aplicamos la señal recibida.
    const peerConnection = createPeerConnection(from, false);
    peers[from] = { peerConnection };
    onPeerConnected?.(from);
    peerConnection.signal(data);
  }
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
