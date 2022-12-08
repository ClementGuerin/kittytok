const { WebcastPushConnection } = require('tiktok-live-connector');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// Username of someone who is currently live
let tiktokUsername = "histoireredditenfrancais";

// Create a new wrapper object and pass the username
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

startTiktokConnection();

function startTiktokConnection(){
    tiktokLiveConnection.connect().then(state => {
        console.info(`Connected to roomId ${state.roomId}`);
    }).catch(err => {
        console.error('Failed to connect', err);
        setTimeout(function(){
            startTiktokConnection();
        }, 10000);
    })
};

tiktokLiveConnection.on('disconnected', () => {
    console.log('Disconnected :(');
    startTiktokConnection();
})

// Define the events that you want to handle
// In this case we listen to chat messages (comments)
tiktokLiveConnection.on('chat', data => {
    io.emit('chat', data);
})

tiktokLiveConnection.on('follow', (data) => {
    io.emit('follow', data);
})

tiktokLiveConnection.on('share', (data) => {
    io.emit('share', data);
})

tiktokLiveConnection.on('member', data => {
    io.emit('member', data);
})

tiktokLiveConnection.on('like', data => {
    io.emit('like', data);
})

tiktokLiveConnection.on('emote', data => {
    io.emit('emote', data);
})