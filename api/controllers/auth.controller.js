import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
  const { name, email,contact,gender,username, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, email,contact,gender,username, password: hashedPassword });
  try{
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  
} catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username  });
    if (!validUser) return next(errorhandler(401, "Username not found"));
    const validPassword =  bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorhandler(405, "Invalid password"));
    const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET);
    const { password: userPassword, ...rest } = validUser._doc;
    res.cookie("token", token, { httpOnly: true })
    .status(200)
    .json(validUser);
    
  } catch (error) {
    next(error);
    
  }

}
  

