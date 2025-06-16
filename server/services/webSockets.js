//** IMPORTS */
import { Server } from "socket.io";

const onlineUsers = new Map();

export const webSockets = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);
    socket.on("addOnlineUsers", (username) => {
      const existingSockets = onlineUsers.get(username) || [];

      if (!existingSockets.includes(socket.id)) {
        onlineUsers.set(username, [...existingSockets, socket.id]);
      }
      // console.log("Online:", onlineUsers);
    });

    socket.on("sendMessage", async (data) => {
      const receiver = data.receiver
      const receiverSockets = onlineUsers.get(receiver);

      if (receiverSockets) {
        receiverSockets.forEach((socketId) => {
          socket.to(socketId).emit("receiveMessage", data);
        });
      } else {
        console.log("Receiver is offline");
      }
    });

    socket.on("disconnect", () => {
      for (const [username, sockets] of onlineUsers.entries()) {
        const updatedSockets = sockets.filter((id) => id !== socket.id);
        if (updatedSockets.length === 0) {
          onlineUsers.delete(username);
        } else {
          onlineUsers.set(username, updatedSockets);
        }
      }
      console.log("User disconnected:", socket.id);
      console.log("Updated online users:", onlineUsers);
    });
  });
};
