import { io } from "socket.io-client";
import.meta.env;  

// Ensure this URL does NOT have a trailing slash (e.g., https://api.onrender.com)
const API_URL = import.meta.env.VITE_API_URL;

export const socket = io(API_URL, {
    transports: ["websocket", "polling"]
});