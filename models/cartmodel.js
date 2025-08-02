import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  items:[
   {
    productid:{
      type:mongoose.Types.ObjectId
    },
    quantity:{
      type:Number,
      default:1
    },
   },
  ],
  total:{
    type:Number,
    required:false
  }
  

    
  
}
);

export const cartmodel = mongoose.model("cart", cartSchema);
