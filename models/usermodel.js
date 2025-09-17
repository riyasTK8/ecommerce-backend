import mongoose from "mongoose"
import { type } from "os"
const userSchema = new mongoose.Schema({
    name:{
     
        type:String,
        required:true
    },
    phone:{
    
        type:Number,
        required:true
    },
    age:{
     
        type:Number,
        required:true
    },
    place:{
    
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    image:{
        type:String
    }
})

export const usermodel = mongoose.model('users',userSchema)