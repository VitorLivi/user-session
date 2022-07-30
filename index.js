const express = require('express');
const session = require('express-session');
const app = express();

const port = 5000;

app.set('trust proxy', 1);

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

redisClient.on('error', (err) => {
  console.log('Could not establish a connection with redis.' + err);
});

redisClient.on('connect', (err => {
  console.log('Connected to redis successfully');
}));

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: '123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 10
  }
}));

app.get("/", (req, res) => {
  res.send("Welcome to express application.");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
