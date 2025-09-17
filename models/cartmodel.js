import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  total: {  
    type: Number,
    required: false,
    default: 0,
  },
});

const cartModel = mongoose.model("cartdetails", cartSchema);
export default cartModel;
