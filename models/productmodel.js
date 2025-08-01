import mongoose from "mongoose";
import { type } from "os";
const productSchema = new mongoose.Schema({
    productname:{
        type:String,
        required:true,
    },
    productprice:{
         type:Number,
         required:true
    },
    productimage:{
        type:String,
        required:true
    },
    productcategory:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productdescription:{
        type:String,
        required:true
    }
})
export const productmodel = mongoose.model("products",productSchema)