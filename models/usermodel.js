import mongoose from "mongoose"
import { type } from "os"
const userSchema = new mongoose.Schema({
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