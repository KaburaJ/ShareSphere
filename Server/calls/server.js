const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const { v4 } = require("uuid")
const {createClient} = require("redis")
const { v4: uuidV4 } = require('uuid')
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'))

const cors = require('cors');

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function startApp() {
  try {
    const redisClient =  createClient();
    redisClient.connect()
    console.log("Connected to Redis")
    
    const redisStore = new RedisStore({
        client: redisClient,
        prefix: ''
    })
    const oneDay = 60 * 60 * 1000 * 24;

    app.use(session({
      store: redisStore,
      secret: process.env.SECRET,
      saveUninitialized: false,
      genid: ()=>v4(),
      resave: true,
      rolling: true,
      unset: 'destroy',
      cookie: {
        httpOnly: true,
        maxAge: oneDay,
        secure: false,
        domain: 'localhost'
      }
    }));

    // Handle WebSocket connection for live share
    io.on('connection', socket => {
      socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
      })
    });

    const port = 5004;
    server.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to the database")
    console.log(error)
  }
}

startApp();
