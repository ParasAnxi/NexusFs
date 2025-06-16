//** IMPORTS */
import User from "../models/User.js";

//** USERNAME */
export const userNameExist = async(req,res)=>{
    try{
        const { userName } = req.body;
        console.log(userName)
        const exist = await User.findOne({userName: userName });
        if (exist) {
          res.status(200).json({ value: true });
        } else {
          res.status(200).json({ value: false });
        }
    }catch(error){
        res.status(400).json({error: error.message})
    }
};
