
import { io } from "socket.io-client";

/**
 * Determine the Socket URL safely.
 */
const getSocketUrl = (): string => {
  try {
    const env = (import.meta as any).env;
    if (env && env.VITE_SOCKET_URL) {
      return env.VITE_SOCKET_URL;
    }
  } catch (error) {}
  
  return "http://localhost:3001";
};

const SOCKET_URL = getSocketUrl();

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true
});
