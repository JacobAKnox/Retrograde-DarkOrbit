import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { join_lobby, create_lobby, leave_lobby, get_lobby, get_num_ready_players, get_num_players } from "./lobbies/lobbies.js";
import { find_or_create_session } from "./sessions/sessions.js";
import { assign_roles, get_game, get_role_info, setup, start_game } from "./games/game.js";
import { set_player_ready } from "./lobbies/lobbies.js";


const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

function redirect_user(socket) {
  if (socket.roomCode === "") {
    socket.emit("redirect", "/");
    return;
  }
  if (get_game(socket.roomCode)) {
    socket.emit("redirect", `/game?code=${socket.roomCode}`);
    return;
  }
  socket.emit("redirect", `/lobby?code=${socket.roomCode}`);
}

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const result = find_or_create_session(sessionID);
  socket.sessionID = result.sessionId;
  socket.userID = result.userId;
  socket.roomCode = result.code;
  socket.username = result.username;
  if (socket.roomCode !== "") {
    socket.join(socket.roomCode);
  }
  setTimeout(() => redirect_user(socket), 500);
  next();
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("send chat msg", ({message}) => {
    console.log('[Room:' + socket.roomCode + ' chat] ' + socket.username + ': ' + message);
    io.in(socket.roomCode).emit("receive chat msg", {username: socket.username, message});
  });

  socket.on("join", (data, callback) => {
    if (data.code === undefined || data.username === undefined) {
      // this shouldn't happen unless someone is doing something outside the website
      callback({
        status: 400,
        message: "bad packet"
      });
    }
    const result = join_lobby(data.code, data.username, socket.userID);
    if (result.status === 200) {
      socket.join(data.code);
      socket.username = data.username;
      socket.roomCode = data.code;
    }
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

  // socket.emit("lobby code", socket.roomCode);

  socket.on("disconnect", () => {
    console.log("user disconnected")
  });

  socket.on("create", (data, callback) => {
    if (data.username === undefined || socket.userID === null) {
      // this shouldn't happen unless someone is doing something outside the website
      callback({
        status: 400,
        message: "bad packet"
      });
    }

    const result = create_lobby(data.username, socket.userID);
    if (result.status === 200) {
      socket.join(result.code);
      socket.username = data.username;
      socket.roomCode = result.code;
    }
    callback(result);
  });
  
  // socket.emit("lobby code", "socket.roomCode");

  socket.on("player_ready",() => {
    const userID = socket.userID;
    const result = set_player_ready(userID);
    if (result.status === 200) {
      const lobby = get_lobby(socket.roomCode);
      io.in(socket.roomCode).emit("ready_count_updated", { 
        readyCount: get_num_ready_players(socket.roomCode), 
        totalPlayers: Object.keys(lobby).length 
      });
    }
    try_start_game(socket);
  });

  async function try_start_game(socket) {
    if (socket.roomCode === "") {
      return;
    }
    const lobby = get_lobby(socket.roomCode);
    if (!lobby) {
      return;
    }
    if (get_num_ready_players(socket.roomCode) < get_num_players(socket.roomCode)) {
      // not enough players ready
      return;
    }

    const result = start_game(lobby, socket.roomCode);
    if (result.status !== 200) {
      // notify clients that the game start has failed.
      io.in(socket.roomCode).emit("receive chat msg", {username: "server", message: `failed to start game. \n ${result.message}`});
    }

    let game = get_game(socket.roomCode);
    assign_roles(game);

    // tell clients to start the game
    io.in(socket.roomCode).emit("game_start", {code: socket.roomCode});
    
    // tell each player their role
    // delay telling players thier role so that they have time to load the page
    setTimeout(async () => {
      const sockets = await io.in(socket.roomCode).fetchSockets();
      sockets.forEach(s => {
        s.emit("receive chat msg", 
            {
              username: "server", 
              message:  `Your role is: ${get_role_info(game, s.userID)}`
            });
      });
    }, 1000);
  }

  socket.on("init ready count", () => {
      const lobby = get_lobby(socket.roomCode);
      io.in(socket.roomCode).emit("ready_count_updated", { 
      readyCount: get_num_ready_players(socket.roomCode), 
      totalPlayers: Object.keys(lobby).length 
    });
  });

});

const PORT = process.env.PORT | 4000;
server.listen(PORT, async () => {
  await setup();
  console.log(`server running at http://localhost:${PORT}`);
});

export function closeServer() {
  server.close();
}
