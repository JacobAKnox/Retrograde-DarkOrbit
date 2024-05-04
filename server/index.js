import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { join_lobby, create_lobby, leave_lobby, get_lobby, get_num_ready_players, get_num_players } from "./lobbies/lobbies.js";
import { find_or_create_session } from "./sessions/sessions.js";
import { assign_roles, get_game, get_role_info, setup, start_game, validate_received_user_poi_values, get_player_POIs, set_player_POIs } from "./games/game.js";
import { set_player_ready } from "./lobbies/lobbies.js";
import { PHASE_STATES } from "./games/game_globals.js";
import { gameLoop, set_status_bar_update, set_timer_update_callback, set_ids_and_names_callback, winners_update } from "./games/turns.js";

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

  // text chat
  socket.on("send chat msg", ({message}) => {
    console.log('[Room:' + socket.roomCode + ' chat] ' + socket.username + ': ' + message);
    io.in(socket.roomCode).emit("receive chat msg", {username: socket.username, message});
  });

  

  // POI updates during action phase
  socket.on("client-sent poi update", (POIs, callback) => {
    console.log('[Room: ' + socket.roomCode + ', User: ' + socket.username + ', POI update]:');
    const allowed_phases = [PHASE_STATES.DISCUSSION_PHASE, PHASE_STATES.ACTION_PHASE];
    let game = get_game(socket.roomCode);
    if (Object.keys(POIs).length === 0) { 
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    }
    if (!game) {
      callback({
        status: 404,
        message: "You are not in a game"
      });
      return;
    }

    if (!allowed_phases.includes(game.currentState)) {
      callback({
        status: 405,
        message: "cannot update point allocation during this phase"
      });
      if (Object.keys(get_player_POIs(game, socket.userID)).length === 0) { 
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
      }
      socket.emit("server-sent poi update", get_player_POIs(game, socket.userID));
      return;
    }

    if(!validate_received_user_poi_values(game, socket.userID, POIs)) {
      callback({
        status: 409,
        message: "client POIs not valid"
      });
      console.log("POIs BAG FAILED!");
      socket.emit("server-sent poi update", get_player_POIs(game, socket.userID));
    }
    else {
      callback({
        status: 200,
        message: "POIs OK"
      });
      set_player_POIs(game, socket.userID, POIs);
    }
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
      updatePlayerList(socket.roomCode); //added this
    }
    callback(result);
  });

  socket.on("leave", (callback) => {
    console.log("left");
    callback(leave_lobby(socket.userID));
    updatePlayerList(socket.roomCode); //added this
  });

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID
  });

  // socket.emit("lobby code", socket.roomCode);

  socket.on("disconnect", () => {
    console.log("user disconnected")
    updatePlayerList(socket.roomCode); //added this 
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
      updatePlayerList(socket.roomCode); //added this
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
        s.emit("role_info", get_role_info(game, s.userID));
      });
    }, 1000);
    gameLoop(socket.roomCode);
  }

  socket.on("init ready count", () => {
      const lobby = get_lobby(socket.roomCode);
      io.in(socket.roomCode).emit("ready_count_updated", { 
      readyCount: get_num_ready_players(socket.roomCode), 
      totalPlayers: Object.keys(lobby).length 
    });
  });

  socket.on('request_player_list', () => {
    updatePlayerList(socket.roomCode);
  });

});

const PORT = process.env.PORT | 4000;
server.listen(PORT, async () => {
  await setup();
  set_timer_update_callback(updateTimer);
  set_ids_and_names_callback(sendIdsAndNames);
  set_status_bar_update(updateStatusBar);
  winners_update(sendWinnersToClient);
  console.log(`server running at http://localhost:${PORT}`);
});

export function closeServer() {
  server.close();
}

export function updateTimer(phase, time, lobbyCode){
  io.in(lobbyCode).emit("update timer phase", {length: time, name: phase});
} 

export function sendIdsAndNames(IDSANDNAMES, lobbyCode){
  io.in(lobbyCode).emit("server-sent poi update", IDSANDNAMES);
} 

function updateStatusBar(lobbyCode, statusBars) {
  io.in(lobbyCode).emit("status_update", statusBars);
}

function sendWinnersToClient(lobbyCode, winners) {
  io.in(lobbyCode).emit("winner_data", winners);
}
//update player lplayer
function updatePlayerList(lobbyCode) {
  const lobby = get_lobby(lobbyCode);
  console.log(`Lobby retrieved: ${JSON.stringify(lobby)}`);
  
  if (!lobby || !Object.keys(lobby).length) {
      console.error(`No players in lobby: ${lobbyCode} or lobby does not exist.`);
      return;
  }

  const playerList = Object.values(lobby).map(player => ({
      id: player.id, 
      name: player.username,
      ready: player.ready_state 
  }));

  console.log(`Emitting player list for lobby ${lobbyCode}:`, playerList); 
  io.in(lobbyCode).emit('player_list_updated', playerList);
}
