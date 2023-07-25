import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const { PORT } = process.env;

const app = express();
const server = http.createServer(app);

server.listen(PORT || 3001, () => {
  console.log("Server running on port 3001");
});

app.use(express.static(__dirname + "/public"));

const users: { [key: string]: string } = {};

const io = new Server(server);

io.on("connection", (client: Socket) => {
  const broadcast = (event: string, data: object) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  };

  broadcast("users", users);

  client.on("message", (message: { name: string; text?: string }) => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast("user", users);
    }
    broadcast("message", message);
  });

  client.on("disconnect", () => {
    delete users[client.id];
    client.broadcast.emit("user", users);
  });
});
