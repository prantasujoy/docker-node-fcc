const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_IP,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoute");

//redis client

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

// Optionally, handle Redis client errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const app = express();

app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("successfuflly connected to db"))
    .catch((error) => {
      console.log(error);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.enable("trust proxy");
app.use(cors({}));
const port = process.env.port || 3000;

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi There,Boss MAN. App is Running</h2>");
});

app.use("/api/v1/posts", postRouter);

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
