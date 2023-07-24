import WebSocket from "ws";

const wsServer = new WebSocket.Server({ port: 5000 });

const socketList: WebSocket[] = [];

wsServer.on("connection", (socket) => {
  socketList.push(socket);
  setTimeout(() => {
    socket.send("Successfully connected to Web Socket Server");
  }, 3000);

  socketList.forEach((item) => {
    if (item !== socket) {
      item.send("New member connected");
    }
  });
});
