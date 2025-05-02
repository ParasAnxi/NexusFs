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

//** FILES CONFIG */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//** CONIG */
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));


//** FILE */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//** ROUTES */
app.use("/auth",authRoutes);
app.use("/message",messageRoutes);
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