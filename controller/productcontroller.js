import { productmodel } from "../models/productmodel.js";
import { categorymodel } from "../models/categorymodel.js";

export const addproduct = async (req, res) => {
    const { productname, productprice, productcategory, productdescription } = req.body;
    console.log(req.body);
    
    
    try {
        let productimage = "";
        if (req.file) {
            productimage = req.file.filename;
        }

        const product = await productmodel.insertOne({
            productname,
            productprice,
            productimage,
            productcategory,
            productdescription,
            new:true
        });

        res.json({ message: "product inserted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ message: "product not added" });
    }
};

export const updateproduct = async (req, res) => {
    const { productname, productprice, productcategory, productdescription } = req.body;
    const product_id = req.params.id;

    let updateData = {
        productname,
        productprice,
        productcategory,
        productdescription
    };

    if (req.file) {
        updateData.productimage = req.file.filename;
    }

    try {
        const productupdation = await productmodel.findByIdAndUpdate(
            product_id,
            { $set: updateData },
            { new: true }
        );

        res.json({ message: 'product details updated successfully', data: productupdation });
    } catch (err) {
        console.log(err);
        res.json({ message: "product details not updated" });
    }
};

export const deleteproduct = async (req, res) => {
    try {
        const product_id = req.params.id
        const productdelete = await productmodel.findByIdAndDelete(product_id)
        res.json({ message: "product deleted successfully", productdelete })
    }

    catch (err) {
        console.log(err);

        res.json({ message: "product not deleted" })
    }

}