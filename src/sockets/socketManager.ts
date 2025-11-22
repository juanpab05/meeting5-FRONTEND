import { io, Socket } from "socket.io-client";


/**
 * Socket manager for the application.
 *
 * This module exposes a shared `socket` instance (not auto-connected)
 * and two helpers: `connectSocket(userId?)` and `disconnectSocket()`.
 *
 * The `SOCKET_URL` is read from `import.meta.env.VITE_SOCKET_URL` and
 * falls back to `http://localhost:3001` for local development.
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

/**
 * Shared Socket.IO client instance.
 *
 * - `autoConnect` is set to `false` so callers explicitly connect when ready.
 * - `transports` is limited to `websocket` for predictable connectivity.
 */
export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

/**
 * Connect the shared socket and, optionally, notify the server of the user id.
 *
 * @param {string} [userId] - Optional user id to emit with the "newUser" event
 *                            after the socket connects.
 */
export const connectSocket = (userId?: string) => {
  if (!socket.connected) {
    socket.connect();
  }

  if (userId) {
    // Inform server which user connected (server may use this for presence)
    socket.emit("newUser", userId);
  }
};

/**
 * Disconnect the shared socket if currently connected.
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
