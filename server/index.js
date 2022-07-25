//
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const { Server } = require('socket.io');

app.use(cors());

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
});

io.on('connect', (socket) => {
    console.log(`connected: ${socket.id}`);

    socket.on("join_a_room", (data) => {
        socket.join(data);
        console.log(data);
    });

    socket.on('send_data', (data) => {
        console.log('Sending data: ', data);
        socket.to(data.room).emit('received_data', data );
        console.log(data.room);
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log(`disconnected: ${socket.id}`);
    });

});


server.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

