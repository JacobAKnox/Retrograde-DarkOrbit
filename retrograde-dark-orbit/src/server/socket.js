// import this module where you need to handle
// socket.io interactions :)
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default socket;

