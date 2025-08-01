import { productmodel } from "../models/productmodel.js";
import { categorymodel } from "../models/categorymodel.js";


export const addproduct = async(req,res)=>{

const {productname,productprice,productimage,productcategory,productdescription} = req.body
console.log(req.body);

try{

    let productimage = ""
    if(req.file){
         productimage = req.file.filename;
    }

const product = await productmodel.insertOne({
    productname,
    productprice,
    productimage: productimage,
    productcategory,
    productdescription

})
res.json({message:"product inserted succesfully"})
}
catch{
    res.json({message:"product not added"})
}

}
    





