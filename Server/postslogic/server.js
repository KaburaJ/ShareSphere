const express = require('express');
const session = require('express-session');
const redis = require('redis');
const logicRoutes = require('./src/routers/LogicRoutes');
const sql = require('mssql')
const config = require('../auth/src/config/userConfig')
const RedisStore = require('connect-redis').default;
const { v4 } = require("uuid")
const {createClient} = require("redis")
require('dotenv').config();

const cors = require('cors');

const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));





async function startApp(){
try {
    const pool = await sql.connect(config)
    console.log("App Connected to database");

    const redisClient =  createClient();
    redisClient.connect()
    console.log("Connected to Redis")
    
    const redisStore = new RedisStore({
        client: redisClient,
        prefix: ''
    })
    const oneDay = 60 * 60 * 1000 * 24;
app.use((req, res, next)=>{req.pool = pool; next()})

// Add the session middleware
app.use(session({
  store: redisStore,
  secret: process.env.SECRET,
  saveUninitialized: false,
  genid: () => v4(),
  resave: true,
  rolling: true,
  unset: 'destroy',
  cookie: {
    httpOnly: true,
    maxAge: oneDay,
    secure: false,
    domain: 'localhost'
  }
}))


app.use('/', async (req, res, next) => {
  try {
    let cookie = req.headers['cookie'];
    if (!cookie) {
      throw new Error('Cookie header is missing.');
    }

    let sessionID = cookie.substring(16, 52);
    let session = await redisClient.get(sessionID);
    if (session) {
      let real_session = JSON.parse(session);
      // console.log(real_session);
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "login to proceed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/', logicRoutes);

app.get('/', (req, res) => {
  res.send('Share Sphere');
});

const port = 5003;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});


} catch (error) {
    console.log("Error connecting to database")
    console.log(error)
}
}

startApp();


