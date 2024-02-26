"use server"

// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

let socket = io('http://localhost:4000');

export async function join_lobby(username, code) {
    return await socket.emitWithAck('join', {username: username, code: code});
}

export async function chat_message(message) {
    socket.emit("send chat msg", message);
}

socket.on("receive chat msg", (message) => {
    console.log(message, socket.id);
})

export async function create_lobby(username) {
    return await socket.emitWithAck('create', {username});
}