//** IMPORTS */
import multer from "multer";
//** FILES */
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

//** FILE STORAGE */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//** UPLOAD */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage });

//** DELETE */
const deleteStorageFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(error);
      throw new Error("Failed to delete file");
    }
  });
};
//** HANDLE FILE STORAGE */
export const fileStorage = async (req, res, next) => {
  const { toDeletePicture } = req.body;
    if(toDeletePicture != ""){
        const filePath = path.join(__dirname, "../public/assets", `${toDeletePicture}`);
        deleteStorageFile(filePath);
    }
  next();
};
