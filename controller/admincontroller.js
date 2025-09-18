import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { usermodel } from '../models/usermodel.js'

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const dbUrl = 'mongodb://localhost:27017/ecommerceproject';
  const connection = await mongoose.connect(dbUrl);
  const db = connection.connection.db;

  const adminData = await db.collection('admin').findOne({ email });

  if (!adminData) {
    return res.json({ success: false, message: "Admin not found" });
  }

  const match = await bcrypt.compare(password, adminData.password);

  if (!match) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  req.session.admin = adminData._id;



  res.json({ success: true, message: "Admin logged in successfully" });
};
export const finduser = async(req,res)=>{
    try{
        const userdata = await usermodel.find()
        console.log(userdata);
        res.json({message:userdata})
        
    }
    catch(err){
        console.log(err);
        
    }
}