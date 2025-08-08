import mongoose from "mongoose";
import orderModel from "../models/ordermodel.js";
import cartModel from "../models/cartmodel.js";
import { productmodel } from "../models/productmodel.js";

export const createorder = async(req,res)=>{
    
    console.log(req.body,"order creation");
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