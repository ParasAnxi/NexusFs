/* IMPORTS */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http";
import { webSockets } from "./services/webSockets.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";

//** DB */
import { connectDB } from "./controllers/connectDB.js"
//** ROUTES IMPORTS */
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/file.js"
import existRoutes from "./routes/exist.js";
import mime from "mime"
//** FILES CONFIG */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//** CONIG */
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));


//** FILE */
// app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(
  "/assets",
  express.static(path.join(__dirname, "public/assets"), {
    setHeaders: (res, filePath) => {
      const contentType = mime.getType(filePath);
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }

      const inlineTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "image/png",
        "image/jpeg",
        "image/gif",
        "video/mp4",
        "audio/mpeg",
        // add more as needed
      ];

      if (inlineTypes.includes(contentType)) {
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

//** ROUTES */
app.use("/auth",authRoutes);
app.use("/message",messageRoutes);
app.use("/find", existRoutes);

//** SERVER AND SOCKETS*/
const server = createServer(app);
webSockets(server);

const PORT = process.env.PORT;
const hostServer = async () => {
  await connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  });
};
hostServer();