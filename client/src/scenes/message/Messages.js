import React, { useDeferredValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messagedUser } from "../../features/messageSlice.js";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllFiles from "./AllFiles.js";

const Messages = () => {
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const allMUsers = useSelector((state) => state.message?.users);
  useEffect(() => {
    if (user?.userName) {
      dispatch(messagedUser(user.userName));
    }
  }, [dispatch, user?.userName]);
  console.log(allMUsers);
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
            width: "100vw",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography fontSize="19px" fontWeight="bold">
              My Files
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ mt: 1, padding: 4 }}>
            {allMUsers.map((user) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => console.log(user.userName)}
              >
                <Avatar />
                <Typography
                  sx={{ fontWeight: "bolder", fontSize: "14", ml: 2 }}
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
