import { io, Socket } from "socket.io-client";


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, 
});


export const connectSocket = (userId?: string) => {
  if (!socket.connected) {
    socket.connect();
  }


  if (userId) {
    socket.emit("newUser", userId);
  }
};


export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
