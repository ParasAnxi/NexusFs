//** IMPORTS */
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/** REGISTER USER */
export const registerUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(userName, password)
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      password: hashPassword,
    });
    const saveUser = await newUser.save();
    res
      .status(201)
      .json({ user: saveUser, message: "User Registered Successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** LOGIN */
export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ error: "User Not Found!!" });
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(401).json({ error: "Invaild credentials!!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
