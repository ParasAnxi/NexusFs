//** IMPORTS */
import express from "express";
import { deleteFile, getParticipantsChats, messagedPeople } from "../controllers/file.js";
import { upload } from "../controllers/fileStorage.js";
import { uploadFile,getFile } from "../controllers/file.js";

//** CONFIG */
const router = express.Router();

//** UPLOAD */
router.post("/sendfile",upload.single("file"), uploadFile);
//** GET USERS */
router.post("/getchats", getParticipantsChats);
router.post("/getmessagedpeople", messagedPeople);
//** GET SINGLE FILE */
router.get("/:unqId", getFile);
//**DELETE FILE */
router.delete("/:unqId",deleteFile);

export default router;
