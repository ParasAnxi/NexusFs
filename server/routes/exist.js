//** IMPORTS */
import express from "express";
import { userNameExist } from "../controllers/exist.js";

//** ROUTER */
const router = express.Router();

//** USER NAME EXIST */
router.post("/user-name-exist", userNameExist);

export default router;
