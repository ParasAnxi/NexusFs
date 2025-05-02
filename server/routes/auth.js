//** IMPORTS */
import express from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/auth.js";
//** CONFIG */
const router = express.Router();

//** REGISTER */
router.post("/register", registerUser);
//** LOGIN */
router.post("/login", loginUser);

export default router;
