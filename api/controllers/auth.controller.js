import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const signup = async (req, res) => {
  const { name, email,contact,gender,username, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, email,contact,gender,username, password: hashedPassword });
  try{
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json(error.message);
  }
  };
  

