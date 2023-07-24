import WebSocket from "ws";

const wsServer = new WebSocket.Server({ port: 5000 });

wsServer.on("connection", () => {
    console.log("New frontend connected");
    
})
