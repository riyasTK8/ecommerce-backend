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


export const loginuser = async(req,res)=>{
   
    const{email,password} = req.body
    const finduser = await usermodel.findOne({email})
    console.log(finduser);
    if(!finduser)
{
    res.json({message:"user not found"})
}
     
    const passwordmatch = await bcrypt.compare(password,finduser.password)
    if(!passwordmatch){
        return res.json({message:"check your password"})
    }
      req.session.user={
        id:finduser._id,
        email:finduser.email
    }
    res.json({message:"user logged successfully",success:true})
  
    console.log(req.session.user);
    
    
}

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

