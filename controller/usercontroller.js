import { usermodel } from "../models/usermodel.js";
import bcrypt from 'bcrypt'


export const insertuser = async (req, res) => {
  try {
    let pro = "";
    if (req.file) {
      pro = req.file.filename;
    }

    const { name,phone,age,place, email, password } = req.body;

   
    const hashedPass = await bcrypt.hash(password, 10);

    const user = new usermodel({
      
      name:name,
      phone:phone,
      age:age,
      place:place,
      email:email,
      password: hashedPass,
    
    });

    await user.save();
    res.json({ message: "User registered successfully",success:true });
  } catch (err) {
    
    res.status(500).json({ message: "server error" });
  }
};


export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated by the admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }


    req.session.user = user._id;
    res.json({ success: true, message: "Login successful", user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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

export const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User status updated to ${user.isActive ? "Active" : "Deactive"}`,
      isActive: user.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



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

