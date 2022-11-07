const express = require('express');
const connectDB = require('./config/db');

const app = express();

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io')
const cors = require('cors');

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE'],
    },
});

// Hides the info that we are using Express from tools such as curl
app.disable('x-powered-by');

// Connect database
connectDB();

app.use(express.json({extended: false}));

app.get('/', (req,res) => res.send('API Running'));

const SOCKET_PORT = process.env.SOCKET_PORT || 5001;

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
    });
});
require('./socket/chatMsg')(io);

server.listen(SOCKET_PORT, () => {
    console.log(`Socket server listening on port ${SOCKET_PORT}`);
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));