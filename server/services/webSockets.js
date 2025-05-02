//** IMPORTS */
import User from "../models/User.js";
import { Server } from "socket.io";
let clients = [];

const onlineUser = new Map();

export const webSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", async ({ userName, priority }) => {
    const user = await User.findOneAndUpdate(
      { socketId: socket.id },
      { userName, priority },
      { upsert: true, new: true }
    );
    clients.push({ socket, priority, socketId: socket.id });
    console.log(`User ${userName} registered with priority ${priority}`);
  });

  socket.on("send-file", async (data) => {
    const fileBuffer = data.file;
    const filename = data.filename;

    const sorted = clients.sort((a, b) => a.priority - b.priority);
    for (let client of sorted) {
      if (client.socket.id !== socket.id) {
        client.socket.emit("receive-file", { filename, file: fileBuffer });
      }
    }
  });

  socket.on("disconnect", async () => {
    console.log("Disconnected:", socket.id);
    clients = clients.filter((c) => c.socket.id !== socket.id);
    await User.deleteOne({ socketId: socket.id });
  });
});
};
