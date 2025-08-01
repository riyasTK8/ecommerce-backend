import { categorymodel } from "../models/categorymodel.js";

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


export const deletecategory  = async(req,res)=>{
    const {categoryname,categorydescription} = req.body
    const category_id =  req.params.id
    try{
        const deletecategorydata = await categorymodel.findByIdAndDelete(category_id)
       res.json({message:"category deleted successfully"})
    }
    catch{
        res.json({message:"check again"})
    }
}
