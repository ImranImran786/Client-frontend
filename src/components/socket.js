import { io } from "socket.io-client";

const socket = io("ws:http://localhost:5005/", { reconnection: true });

socket.on("connect", () => {
    console.log("Connected to WebSocket Server");
    socket.emit("registerClient", "client-456");
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket Server");
});

export default socket;
