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

app.use(express.json());

async function startApp(){
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
    cookie:{
        httpOnly: true,
        maxAge: oneDay,
        secure: false,
        domain: 'localhost'
    }
    }))

    app.use('/', async(req, res, next) => {
        let cookie = req.headers['cookie'];
        if (cookie) {
          let sessionID = cookie.substring(16, 52);
          let session = await redisClient.get(sessionID);
          if (session) {
            let real_session = JSON.parse(session);
            console.log(real_session);
            next();
          } else {
            res.status(403).json({
              success: false,
              message: "login to proceed"
            });
          }
        } else {
          res.status(403).json({
            success: false,
            message: "cookie not found"
          });
        }
      });      

    // app.get('/', (req, res) => {
    // res.send('Share Sphere');
    // });

    app.get('/', (req, res) => {
        res.redirect(`/${uuidV4()}`)
      })
      

    app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
    })
    
    io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

    const port = 5004;
    server.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
    });


    } catch (error) {
        console.log("Error connecting to database")
        console.log(error)
    }
}

startApp();


