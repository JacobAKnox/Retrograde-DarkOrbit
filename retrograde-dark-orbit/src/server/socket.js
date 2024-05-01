"use client"

import { navigate } from './../components/navigation';
import { useEffect } from 'react';
// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';
import { getItem, storeItem } from './storage';

const GAME_OVER_PHASE = "Game Over";

const server_addr = process.env.NEXT_PUBLIC_SERVERADDRESS || "localhost";
const server_port = process.env.NEXT_PUBLIC_SERVERPORT || "4000";

console.log(`Connecting to ${server_addr}:${server_port}`);

let socket = io(`http://${server_addr}:${server_port}`, {autoConnect: false});
let recMessage = (e) => {};
let recPOIs = (e) => {};

const sessionID_storage = "sessionID";

const connect = () => {
    const sessionID = getItem(sessionID_storage);
    
    if (sessionID) {
        socket.auth = { sessionID };
    }

    socket.on("session", ({ sessionID, userID }) => {
        socket.auth = { sessionID };
        storeItem(sessionID_storage, sessionID);
        socket.userID = userID;
    });

    socket.on("game_start", ({code}) => {
        storeItem("code", code);
        navigate(`/game?code=${code}`);
    });

    socket.on("redirect", (path) => {
      navigate(path);
    });

    socket.on("update timer phase", (phase) => {
      if (phase.name === GAME_OVER_PHASE) {
        const code = getItem("code");
        storeItem("time", phase.length);
        navigate(`/gameover?code=${code}`);
      }
    });

    //data format: {team: str, names:[str]}
    socket.on("winner_data", (data) => {
      storeItem("winner", data);
    });

    socket.connect();
}

export async function join_lobby(username, code) {
    return await socket.emitWithAck('join', {username: username, code: code});
}

export async function leave_lobby() {
    return await socket.emitWithAck('leave');
}

socket.on("receive chat msg", (message) => {
    console.log(message, socket.id);
})

export async function create_lobby(username) {
    return await socket.emitWithAck('create', {username});
}

export default function Connector() {
    useEffect(connect, []);
}

export async function chat_message(message) {
    socket.emit("send chat msg", {message});
}

export function chat_message_listener(callback) {
    recMessage = callback;
}

export function server_sent_poi_listener(callback) {
    recPOIs = callback;
}

export function update_player_ready() {
    socket.emit("player_ready");
}

const role_info_storage = "RoleInfo";
export function update_role_info(callback) {
  socket.on("role_info", (info) => {
    storeItem(role_info_storage, JSON.stringify(info));
    callback(info.name, info.max_points);
  });
  return JSON.parse(getItem(role_info_storage));
}

export const update_ready_status = (updateReadyStatus) => {
  socket.on("ready_count_updated", (data) => {
    updateReadyStatus({
      num_ready: data.readyCount, 
      num_total: data.totalPlayers
    });
  });
  socket.emit("init ready count");
};

export const set_turn_timer = (setTurnTimer) => {
  socket.on("update timer phase", (phase) => {
    setTurnTimer(phase);
  });
};

export const toggle_turn_timer_countdown = (toggleTurnTimer) => {
  socket.on("toggle turn timer countdown", () => {
    toggleTurnTimer();
  });
};

const status_bar_storage = "StatusBar";
export function listen_status_bar_update(callback) {
  socket.on("status_update", (statusBars) => {
    storeItem(status_bar_storage, JSON.stringify(statusBars))
    callback(statusBars);
  });
  return JSON.parse(getItem(status_bar_storage));
}

//update player list
export function listen_update_player_list(updatePlayerList){
  socket.on('player_list_updated', (players) => {
    updatePlayerList(players);  
  });
}
//
export function request_current_player_list() {
  socket.emit('request_player_list');
}

// chat message received from server
socket.on("receive chat msg", ({username, message}) => {
    recMessage('[' + username + ']: ' + message)
});

export async function send_poi_update(POIs) {
  return await socket.emitWithAck("client-sent poi update", POIs);
}

socket.on("server-sent poi update", (POIs) => {
  recPOIs(POIs);
  console.log(POIs);
})

export function listen_winner_info(cb) {
  //data format: {team: str, names:[str]}
  socket.on("winner_data", (data) => {
    cb(data);
  });
}

// socket.on("lobby code", (code) => {
//     console.log("FROM SOCKET ON");
//     console.log(code);
// })