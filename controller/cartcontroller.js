import mongoose from "mongoose";
import cartModel from "../models/cartmodel.js";

export const addTocart = async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);

  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  const { id: userId } = req.session.user;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  try {
    let cart = await cartModel.findOne({ userId });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity,
        });
      }

      await cart.save();
      return res.status(200).json({ message: "Product added to cart" });
    } else {
      const newCart = await cartModel.create({
        userId,
        items: [{ productId: new mongoose.Types.ObjectId(productId), quantity }],
      });
      return res.status(201).json({ message: "New cart created", data: newCart });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const showTotalAmount = async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  try {
    const { id } = req.session.user;
    const userId = new mongoose.Types.ObjectId(id);

    const cart = await cartModel.aggregate([
      { $match: { userId } },            // Match cart for logged-in user
      { $unwind: "$items" },             // Deconstruct items array
      {
        $lookup: {                      // Lookup product details from 'products' collection
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "Details",
        },
      },
      { $unwind: { path: "$Details", preserveNullAndEmptyArrays: true } }, // Unwind product details
      {
        $addFields: {                   // Calculate subtotal per item
          subtotal: {
            $multiply: [
              "$items.quantity",
              { $ifNull: ["$Details.productprice", 0] },  // Use productprice or 0
            ],
          },
        },
      },
      {
        $group: {                      // Group by userId to reconstruct cart
          _id: "$userId",
          cartitems: {
            $push: {
              productId: "$items.productId",
              quantity: "$items.quantity",
              name: "$Details.productname",     // Product name
              image: "$Details.productimage",   // Product image
              price: { $ifNull: ["$Details.productprice", 0] },  // Price per product
              subtotal: "$subtotal",            // Calculated subtotal
            },
          },
          total: { $sum: "$subtotal" },          // Sum of all subtotals
        },
      },
    ]);

    if (!cart.length) {
      return res.status(404).json({ message: "Cart not found." });
    }

    return res.status(200).json({ cart: cart[0] });  // Return first (and only) cart
  } catch (err) {
    console.error("Error in showTotalAmount:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};



export const editCart = async (req, res) => {
  const { id: userId } = req.session.user;
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({ message: "Product quantity updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const deleteCartItem = async (req, res) => {
  const { id: userId } = req.session.user;
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const deleted = cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Product deleted from cart", deleted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



