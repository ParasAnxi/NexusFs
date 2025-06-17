import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messagedUser } from "../../features/messageSlice.js";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
//** SOCKETS */
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", { autoConnect: true });

const Messages = () => {
  //** USERS */
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const allMUsers = useSelector((state) => state.message?.users);
  //** LOCAL */
  const [allFolders, setAllFolders] = useState([]);
  useEffect(() => {
    if (user?.userName) {
      dispatch(messagedUser(user.userName));
    }
  }, [dispatch, user?.userName]);

  useEffect(()=>{
    setAllFolders(allMUsers);
  },[allMUsers]);

  console.log(allFolders)

  useEffect(() => {
      if (!user?.userName) return;
  
      if (socket.connected) {
        socket.emit("addOnlineUsers", user.userName);
      } else {
        socket.on("connect", () => {
          socket.emit("addOnlineUsers", user.userName);
        });
      };
  }, [user.userName]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.receiver === user.userName) {
        const newData = {
          userName: data.sender,
          userId: data.unqId
        };

        setAllFolders((prev) => {
          const exists = prev.some((u) => u.userName === newData.userName);
          return exists ? prev : [...prev, newData];
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user.userName]);

  const { palette } = useTheme();
  const Navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography fontSize="19px" fontWeight="bold">
              My Files
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              mt: 1,
              padding: 4,
              flexBasis: "1",
              gap: "10rem",
            }}
          >
            {allFolders.map((user) => (
              <Box
                key={user?.userId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  width: "150px",
                }}
                onClick={() => Navigate(`/allFile/${user.userName}`)}
              >
                <FolderIcon
                  sx={{ fontSize: "100px", color: palette.primary.main }}
                />
                <Typography
                  sx={{ fontWeight: "bolder", fontSize: "20px", ml: 2 }}
                  key={user?.userId}
                >
                  {user?.userName}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Messages;
