import { cartmodel } from "../models/cartmodel.js";
import { productmodel } from "../models/productmodel.js";
import { usermodel } from "../models/usermodel.js";

export const addcart = async (req, res) => {
    try {
        const product_id = req.params.id;
        const { quantity } = req.body;
        const userId = req.session.user.id;

        let cart = await cartmodel.findOne({ userId: userId });

        if (cart) {
            const findIndex = cart.items.findIndex(item => item.productid == product_id);

            if (findIndex < 0) {
       
                cart.items.push({ productid: product_id, quantity });
            } else {
              
                cart.items[findIndex].quantity += quantity;
            }

            await cart.save();
            res.json({ message: "Cart updated successfully" });

        } else {
        
            const newCart = new cartmodel({
                userId,
                items: [{ productid: product_id, quantity }]
            });

            await newCart.save();
            res.json({ message: "Cart created and product added" });
        }

    } catch (error) {
        console.error("error adding to cart:", error);
        res.json({message:"product not added"});
    }
};
