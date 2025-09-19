import { usermodel } from "../models/usermodel.js";
import bcrypt from 'bcrypt'



export const insertuser = async (req, res) => {
  try {
    const { name, phone, age, place, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    const user = new usermodel({
      name,
      phone,
      age,
      place,
      email,
      password: hashedPass,
    });

    await user.save();
    res.json({ message: "User registered successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginuser = async (req, res) => {
  const { email, password } = req.body;

  const finduser = await usermodel.findOne({ email });
  if (!finduser) return res.json({ success: false, message: "User illa" });

  if (!finduser.active)
    return res.json({ success: false, message: "admine contact aakk" });

  const passwordmatch = await bcrypt.compare(password, finduser.password);
  if (!passwordmatch) return res.json({ success: false, message: "Incorrect password" });

  req.session.user = { id: finduser._id, email: finduser.email };
  return res.json({ success: true, message: "User logged in successfully" });
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usermodel.findById(id);
    if (!user) return res.json({ success: false, message: "User not found" });

    user.active = !user.active;
    await user.save();
    res.json({ success: true, active: user.active, message: "Status updated" });
    
  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
};




export const updateuser = async(req,res)=>{
  try{
    const  user_id = req.params.id;
    const olduser = await usermodel.findById(user_id)
    const newuser = ({
      email:olduser.email,
      password:olduser.password
    })
   
    if(req.body.email){
      newuser.email = req.body.email
    }

    if(req.body.password){
      newuser.password = req.body.password
    }
    console.log(newuser.email);
    
    const updateduser = await usermodel.findByIdAndUpdate(user_id,newuser)
    res.json({message:"user updated",updateduser})

  }
  catch{
    res.json({message:"user not found"})
  }
}


export const deleteuser = async(req,res)=>{
try{
  const user_id = req.params.id
  const userdelete = await usermodel.findByIdAndDelete(user_id)
  res.json({message:"your account deleted successfully"})
}
catch{
  res.json({message:"your account not deactivated"})
}
}


export const logout = (req,res)=>{
  req.session.user = null
  if(req.session.user==null){
    res.json({message:"user logout successfully"})
  }

  else{
    res.json({message:"user not logout"})
  }
}

