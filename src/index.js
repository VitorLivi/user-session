const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 5000;

(async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  app.set('trust proxy', 1);const RedisStore = connectRedis(session)

  const redisClient = redis.createClient({ 
    url: 'redis://user-session-redis:6379', 
    legacyMode: true // Need if you are using redis v4.0^
  })

  await redisClient.connect().then(() => {
    console.log('Connected to redis successfully');
  }).catch( err => {
    console.log('Could not establish a connection with redis. ' + err);
  })

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
  }))

  app.get("/", (req, res) => {
    const sess = req.session;

    if (sess.username) {
      return res.send("Welcome user: " + sess.username);
    } else {
      return res.send ("User not authenticated");
    }
  });

  app.post("/login", (req, res) => {
    const sess = req.session;
    const { username } = req.body
    
    sess.username = username
    
    return res.end("Ok")
  });

  app.post("/logout", (req, res) => {
      req.session.destroy(err => {
          if (err) {
              console.log(err);
              return res.send('Error on logout')
          }

          res.send('Ok')
      });
  });
  
  app.listen(PORT, () => {
    console.log("Server running on port" + PORT)
  })
})()