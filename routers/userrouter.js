import express from 'express'
import multer from 'multer'
import path from 'path'
import { deleteuser, insertuser, loginuser, updateuser } from '../controller/usercontroller.js'

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


userrouter.post("/signup", upload.single("image"), insertuser)
userrouter.post("/login",loginuser)
userrouter.put('/update/:id',updateuser)
userrouter.delete('/delete/:id',deleteuser)
