import cartModel from "../models/cartmodel.js";
import { productmodel } from "../models/productmodel.js";
import mongoose from "mongoose";


export const addTocart = async (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;
  const { id: userId } = req.session.user;

  try {
    let cart = await cartModel.findOne({ userId });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      return res.json({ message: "Product added to cart" });
    } else {
      const newCart = await cartModel.create({
        userId,
        items: [{ productId, quantity }],
      });
      return res.json({ message: "New cart created", data: newCart });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const showTotalAmount = async (req, res) => {
  try {
    const { id } = req.session.user;
    const userId = new mongoose.Types.ObjectId(id);

    const result = await cartModel.aggregate([
      { $match: { userId } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $addFields: {
          subtotal: {
            $multiply: ["$productDetails.productprice", "$items.quantity"]
          }
        }
      },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$subtotal" }
              }
            }
          ],
          details: [
            {
              $project: {
                _id: 1,
                userId: 1,
                items: 1,
                productDetails: 1,
                subtotal: 1
              }
            }
          ]
        }
      }
    ]);

    res.json(result[0]); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const editCart = async (req, res) => {
  const { id: userId } = req.session.user;
  const { quantity } = req.body;
  const productId = req.params.id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId
    );

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json({ message: "Product quantity updated" });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const { id: userId } = req.session.user;
  const productId = req.params.id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const deleted = cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.json({ message: "Product deleted", deleted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
