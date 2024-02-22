import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { join_lobby, leave_lobby } from "./lobbies/lobbies.js";
import { find_or_create_session } from "./sessions/sessions.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const result = find_or_create_session(sessionID);
  socket.sessionID = result.sessionId;
  socket.userID = result.userId;
  next();
});

io.on("connection", (socket) => {
  socket.on("send chat msg", (data) => {
    socket.emit("receive chat msg", data);
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
    const result = join_lobby(data.code, data.username, socket.userID);
    if (result.status === 200) {socket.username = data.username;}
    callback(result);
  });

  socket.on("leave", (callback) => {
    console.log("left");
    callback(leave_lobby(socket.userID));
  });

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID
  });

  console.log("connect")
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});

export function closeServer() {
  server.close();
}
