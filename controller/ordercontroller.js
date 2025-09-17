import mongoose from "mongoose";
import orderModel from "../models/ordermodel.js";
import cartModel from "../models/cartmodel.js";
import { productmodel } from "../models/productmodel.js";

export const createorder = async(req,res)=>{
    try{
        console.log("order creation");
        const userId = req.session.user.id 
        const findcart = await cartModel.findOne({userId})
        console.log(findcart);
        if(!findcart){
            res.json({message:"you dont have cart check again"})
        }
        let total = 0;
        let subtotal = 0;
        let items = []
        
        for(let eachitems of findcart.items){
            const product = await productmodel.findById(eachitems.productId)
            if(!product){
                continue
            }
            subtotal = product.productprice * eachitems.quantity
            total+=subtotal
            items.push({
                userId,
                productName:product.productname,
                productPrice:product.productprice,
                quantity:eachitems.quantity,
                subtotal
                
            })
        }
        
        await orderModel.create({
            userId,
            items,
            total,
            deliveryStatus:"pending",
            
            
        })
        
        await cartModel.deleteOne({userId})
        res.json({message:"order placed successfully"})
        
    }
    catch (err){
       console.log(err);
       
    }
}


export const findallorders = async (req,res)=>{
    try{
       const allorders = await orderModel.find()
       console.log(allorders);
       res.json({allorders:allorders})
    }
    catch{
       console.log("cant take all orders");
       
    }
}



export const findorders = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const orders = await orderModel.find({ userId });
        res.json({ orders });
    } catch (error) {
        res.json({ message: "no orders" });
    }
};

export const updateorder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const orderId = req.params.id;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    if (order.deliveryStatus === "delivered" && orderStatus === "pending") {
      return res.status(400).json({ message: "Delivered orders cannot be set to pending" });
    }

    order.deliveryStatus = orderStatus;
    await order.save();
    res.json({ message: "Order status updated", updatedOrder: order });
  } catch (err) {
    res.status(500).json({ message: "Order status not updated" });
  }
};
