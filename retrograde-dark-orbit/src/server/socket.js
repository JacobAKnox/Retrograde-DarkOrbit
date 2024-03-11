"use client"

import { useEffect } from 'react';
// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

let socket = io('http://localhost:4000');
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
export function start_game() {
    socket.emitWithAck("start_game");
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

export const update_ready_status = (updateReadyStatus) => {
  socket.emit("init ready count");
  socket.on("ready_count_updated", (data) => {
    updateReadyStatus({
      num_ready: data.readyCount, 
      num_total: data.totalPlayers
    });
  });
};

socket.on("receive chat msg", ({username, message}) => {
    recMessage('[' + username + ']: ' + message)
})

socket.on("lobby code", (code) => {
    console.log("FROM SOCKET ON");
    console.log(code);
})
