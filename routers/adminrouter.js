import express from 'express'
export const adminrouter = express.Router()
import multer from 'multer'
import path from 'path'
import {  adminlogin } from '../controls/admincontroller.js'
import { addcategory, deletecategory, updatecategory } from '../controls/categorycontroller.js'
import { addproduct } from '../controls/productcontroller.js'



adminrouter.post("/login",adminlogin)
adminrouter.post('/addcategory',addcategory)
adminrouter.put('/updatecategory/:id',updatecategory)
adminrouter.delete('/deletecategory/:id',deletecategory)




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




