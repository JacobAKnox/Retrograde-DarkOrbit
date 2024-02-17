import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';

const app = express();
const server = createServer(app);
export const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('join', (data, callback) => {
    // add join room logic here
    console.log(`Joined room ${data.code} with username ${data.username}`);
    callback({
      status: 'ok'
    });
  });
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});

export function closeServer() {
  server.close();
}
