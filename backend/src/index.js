// let's go!
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// use express middleware to populate current users 

//decode JWT so we can use the userID 
server.express.use((req, res, next) =>  {
    const {token} = req.cookies;
    if (token) {
        const {userId} = jwt.verify(token,process.env.APP_SECRET );
        req.userId = userId; 
        // console.log("this is the userID:" + req.userId);
    }
    // console.log("hey look at me morty, im a middleware! I'm middleware rick!");
    next();
    // res.send('test');
});

//create middleware that populates the user on each request 
server.express.use(async(req, res, next) => {
    if(!req.userId) return next();
    const user = await db.query.user(
        { where: { id: req.userId } },
        '{id, permissions, email, name}'    
    );
    // console.log(user);
    req.user = user; 
    next();
})

server.start(
    // {
    //     cors: {
    //         credentials: true, 
    //         origin: process.env.FRONTEND_URL, 
    //     },
    // },
    deets => {
        console.log(`Server is now running on port https:/localhost:${deets.port}`);
    }
)