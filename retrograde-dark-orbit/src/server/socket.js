// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

export let socket = io('http://localhost:4000');

export async function join_lobby(username, code) {
    "use server"
    return await socket.emitWithAck('join', {username: username, code: code});
}