import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { join_lobby } from "./lobbies/lobbies.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("send chat msg", (message) => {
    console.log(`Message: ${message}`);
    socket.emit("receive chat msg", message);
  });

  socket.on("join", (data, callback) => {
    // add join room logic here
    if (data.code === undefined || data.username === undefined) {
      // this shouldn't happen unless someone is doing something outside the website
      callback({
        status: 400,
        message: "bad packet"
      });
    }
    callback(join_lobby(data.code, data.username));
  });
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});

export function closeServer() {
  server.close();
}
