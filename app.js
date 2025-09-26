import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import MongoStore from 'connect-mongo';
import session from 'express-session'
import { userrouter } from './routers/userrouter.js';
import { dymmyrouter } from './router.js';
import { adminrouter } from './routers/adminrouter.js';
import cors from 'cors'




dotenv.config();
 
const app = express(); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '1234567',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax',  
    secure: false   
  },
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://riyasdevxtra_db_user:jOnCAyuK5DRCToTg@myecommercebackend.dkfrttl.mongodb.net/?retryWrites=true&w=majority&appName=myecommercebackend",
    collectionName: 'sessions'
  })
}));

app.use(express.static("uploads"))
app.use(express.urlencoded())
app.use(express.json())
app.use(cors({
  origin: 'http://13.51.206.203:5173',  
  credentials: true
}));

app.use(bodyParser.json());
app.use("/user",api/userrouter)
app.use("/admin",api/adminrouter)




mongoose.connect("mongodb+srv://riyasdevxtra_db_user:jOnCAyuK5DRCToTg@myecommercebackend.dkfrttl.mongodb.net/?retryWrites=true&w=majority&appName=myecommercebackend")
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



