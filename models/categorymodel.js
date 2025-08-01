import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    },
    categorydescription:{
     type:String,
     required:true
    }
})
export const categorymodel = mongoose.model('category',categorySchema)