const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');


const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server , {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

io.on('connection',(socket) => {
    socket.on('join',({ name, room }, callback) => {
      console.log(name,room);
    })

    socket.on('disconnect',() =>{
        console.log("user disconnected!");
    })
})



app.use(router);

server.listen(PORT, () => {
    console.log(`server has started at port ${PORT}`);
})