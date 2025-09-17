import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  deleteuser,
  insertuser,
  loginuser,
  logout,
  updateuser
} from '../controller/usercontroller.js';

import {
  addTocart,
  showTotalAmount,
  editCart,
  deleteCartItem
} from '../controller/cartcontroller.js';
import { createorder, findorders, updateorder } from '../controller/ordercontroller.js';
import { singleproductfind } from '../controller/productcontroller.js';
import { findProductByCategory } from '../controller/categorycontroller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const userrouter = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


userrouter.post('/signup', upload.single('image'), insertuser);
userrouter.post('/login', loginuser);
userrouter.put('/update/:id', updateuser);
userrouter.delete('/delete/:id', deleteuser);
userrouter.post('/logout',logout)


userrouter.post('/addcart/:id', addTocart); 
userrouter.get('/showcart', showTotalAmount);
userrouter.put('/updatecart/:id', editCart);
userrouter.delete('/deletecart/:id', deleteCartItem);



userrouter.post("/createorder",createorder)
userrouter.get("/findorder",findorders)
userrouter.get("/showsingleproduct/:id",singleproductfind)

userrouter.get("/findproductbycategory/:id", findProductByCategory);