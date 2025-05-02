//** IMPORTS */
import express from "express";
import { getParticipantsChats, messagedPeople, saveMessage } from "../controllers/file.js";
import { upload } from "../controllers/fileStorage.js";
//** CONFIG */

const router = express.Router();

//** GET USERS */
router.post("/sendmessage",upload.single("file"), saveMessage);
router.post("/getchats", getParticipantsChats);
router.post("/getmessagedpeople", messagedPeople);

export default router;
