"use client"

import { navigate } from './../components/navigation';
import { useEffect } from 'react';
// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

const server_addr = process.env.NEXT_PUBLIC_SERVERADDRESS || "localhost";
const server_port = process.env.NEXT_PUBLIC_SERVERPORT || "4000";

console.log(`Connecting to ${server_addr}:${server_port}`);

let socket = io(`http://${server_addr}:${server_port}`, {autoConnect: false});
let recMessage = (e) => {};

const connect = () => {
    if (typeof window !== 'undefined') {
        // session storage to make testing easier, probably change to local storage later
        // session storage is not shared across tabs, but is across refresh
        const sessionID = sessionStorage.getItem("sessionID");
        if (sessionID) {
            socket.auth = { sessionID };
        }
    }

    socket.on("session", ({ sessionID, userID }) => {
        socket.auth = { sessionID };
        sessionStorage.setItem("sessionID", sessionID);
        socket.userID = userID;
    });

    socket.on("game_start", ({code}) => {
        navigate(`/game?code=${code}`);
    });

    socket.on("redirect", (path) => {
      navigate(path);
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

export function update_player_ready() {
    socket.emit("player_ready");
}

export function update_role_info(callback) {
  socket.on("role_info", ({name, max_points}) => {
    callback(name, max_points);
  });
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

socket.on("receive chat msg", ({username, message}) => {
    recMessage('[' + username + ']: ' + message)
})

// socket.on("lobby code", (code) => {
//     console.log("FROM SOCKET ON");
//     console.log(code);
// })
