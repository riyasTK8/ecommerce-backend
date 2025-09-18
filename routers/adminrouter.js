import express from 'express'
export const adminrouter = express.Router()
import multer from 'multer'
import path from 'path'
import {  adminLogin, finduser } from '../controller/admincontroller.js'
import { addcategory, deletecategory, showcategory, updatecategory } from '../controller/categorycontroller.js'
import { addproduct, categoryname, deleteproduct, showproduct, singleproductfind, updateproduct } from '../controller/productcontroller.js'
import { updateorder } from '../controller/ordercontroller.js'
import { findallorders } from '../controller/ordercontroller.js'
import { toggleUserStatus } from '../controller/usercontroller.js'




adminrouter.post("/login",adminLogin)
adminrouter.post('/addcategory',addcategory)
adminrouter.put('/updatecategory/:id',updatecategory)
adminrouter.get("/showcategory",showcategory)
adminrouter.delete('/deletecategory/:id',deletecategory)

adminrouter.patch('/toggle-status/:id', toggleUserStatus);


export const userrouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, call) {
        call(null, "uploads")
    },
    filename: (req, file, call) => {
        const name = Date.now() + path.extname(file.originalname)
        call(null, name)
    }
})

const upload = multer({ storage: storage })
adminrouter.post("/addproduct", upload.single("productimage"),addproduct)
adminrouter.put("/updateproduct/:id",upload.single('productimage'),updateproduct)
adminrouter.delete("/deleteproduct/:id",deleteproduct)
adminrouter.get("/showproducts",showproduct)




adminrouter.put('/updateorder/:id',updateorder)
adminrouter.get("/finduser",finduser)
adminrouter.get("/findallorders",findallorders)
 adminrouter.get("/categoryname",categoryname)