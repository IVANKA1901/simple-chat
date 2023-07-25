import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const { PORT } = process.env;

const app = express();
const httpServer = http.createServer(app);

httpServer.listen(PORT || 3003, () => {
  console.log(`Server running on port 3003`);
});

app.use(express.static(path.join(__dirname + "/public")));

const users: { [key: string]: string } = {};

const io = new Server(httpServer);

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
