import express from 'express'


export const dymmyrouter = express.Router()


const router = express.Router();





 const data = new Promise((resolve, reject) => {
     const num1 = 200
     if(num1 > 50){
        resolve(num1)
     }
     else{
        reject()
     }
 }) 

 