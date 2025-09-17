import { categorymodel } from "../models/categorymodel.js";
import { productmodel } from "../models/productmodel.js";

export const addcategory = async(req,res)=>{
    const {categoryname,categorydescription} = req.body
try{
 const category  =  categorymodel.insertOne(req.body)
 res.json({message:"category added successfully"})
}
catch{
    res.json({message:"category not added"})
}
}

export const updatecategory = async(req,res)=>{
    const {categoryname,categorydescription} = req.body
    const category_id = req.params.id 
    try{
        const editcategorydata  =  await categorymodel.findByIdAndUpdate(category_id,{
            categoryname:req.body.categoryname,
            categorydescription:req.body.categorydescription
        }
    )
    res.json({message:"category updated successfully"})
    }
    catch{
        res.json({message:"category not updated try again"})
    }
    
}

export const showcategory = async(req,res)=>{
    try{
        const findcategory = await categorymodel.find()
        res.json({categories:findcategory})
    }
    catch{
        console.log("category cant find");
        
    }
}

export const deletecategory = async (req, res) => {
    const category_id = req.params.id;
    try {
        const deletecategorydata = await categorymodel.findByIdAndDelete(category_id);
        if (!deletecategorydata) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Check again", error: err.message });
    }
};





export const findProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    console.log(categoryId);
    
    const productsInCategory = await productmodel.find({ productcategory: categoryId });
       console.log(productsInCategory);
    res.json({  products: productsInCategory });
  
    

  } catch (err) {
    console.error(err);
   ;
  }
};



