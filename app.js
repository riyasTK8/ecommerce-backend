import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import MongoStore from 'connect-mongo';
import session from 'express-session'
import { userrouter } from './routers/userrouter.js';
import { adminrouter } from './routers/adminrouter.js';



dotenv.config();
 
const app = express(); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '1234567',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl: process.env.DBURL,
    collectionName: 'sessions'
  })
}));

app.use(express.urlencoded())
app.use(express.json())
app.use(bodyParser.json());
app.use("/user",userrouter)
app.use("/admin",adminrouter)




mongoose.connect(process.env.DBURL)
    .then(() => {
        console.log('database connected successfully');   
    })
    .catch((err) => {
        console.error('error connecting to database:', err);
    });

app.get('/', (req, res) => {
    res.json({ message: "router worked" });
});

app.listen(9000, () => {
    console.log('Server started on http://localhost:9000');  
});







