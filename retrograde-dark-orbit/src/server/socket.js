"use client"

import { useEffect } from 'react';
// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

let socket = io('http://localhost:4000');

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

    socket.on("receive chat msg", ({username, message}) => {
        console.log('[' + username + ']: ' + message);
    })
}

export async function join_lobby(username, code) {
    return await socket.emitWithAck('join', {username: username, code: code});
}

export async function leave_lobby() {
    return await socket.emitWithAck('leave');
}

export default function Connector() {
    useEffect(connect, []);
}

export async function chat_message(message) {
    socket.emit("send chat msg", {message});
}