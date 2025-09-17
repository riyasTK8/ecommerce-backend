import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { usermodel } from '../models/usermodel.js'

export const adminlogin = async (req, res) => {
    const { email, password } = req.body


    const dburl = 'mongodb://localhost:27017/ecommerceproject'
    const data = await mongoose.connect(dburl)
    const db = data.connection.db


    const admindata = await db.collection('admin').findOne({ email: email })


    if (!admindata) {
        res.json({ message: "admin not found" })
    }
    console.log(`${password}`);
    console.log(`${admindata.password}`);

    let match = await bcrypt.compare(password, admindata.password)

    
    if (!match) {
        console.log("hi");
        return res.json({ message: "check your password" })
    }

    console.log("hello");

    req.session.admin = admindata._id

    res.json({ message: "admin logged successfully",success:true })
}


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