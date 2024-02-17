// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

export let socket = io('http://localhost:4000');

export async function join_lobby(username, code) {
    const result = await socket.emitWithAck('join', {username: username, code: code});
    return result.status === 'ok';
}