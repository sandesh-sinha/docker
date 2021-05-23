const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session')
const redis = require('redis')
const cors = require('cors');
const { MONGO_PASSWORD, MONGO_PORT , MONGO_IP, MONGO_USER, REDIS_URL, REDIS_PORT,SESSION_SECRET} = require('./config/config');



let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    host : REDIS_URL,
    port : REDIS_PORT,
})



const app = express()
const port =  process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
// const connectWithRetry = () =>{
//     mongoose.connect(mongoURL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//     })
//     .then(()=>{
//         console.log("successfully connected to mongo db")
//     })
//     .catch((e)=>{
//         setTimeout(connectWithRetry, 2000);
//     }) 
// }
// connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(session({
    store : new RedisStore({client: redisClient}),
    secret : SESSION_SECRET,
    cookie : {
        secure : false,
        resave : false,
        saveUninitialized : false, 
        httpOnly: true, 
        maxAge : 60000
    }
}));
app.use(express.json());

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(()=>{
    console.log("successfully connected to mongo db")
})
.catch((e)=>{
    console.log("didnt connected")
    console.log(e);
})
app.get('/api/v1/', (req,res)=>{
    console.log("fulfilled  request");
    return res.send("<h1>New app hello sandesh!!!!!!!<h1>");
})

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
})