import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import {
  Avatar,
  Box,
  Button,
  Divider,
  InputBase,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "./../../components/FlexBetween";
import { messagedUser, sendUserMessage } from "../../features/messageSlice";
import Navbar from "../navbar/Navbar";
const Message = () => {
  const user = useSelector((state) => state.user.user);
  // console.log(user.sender);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const initialValues = {
    sender: "",
    receiver: "",
    // file: null
  };

  const handleSubmit = (values,{resetForm}) => {
    const sender = user.userName;
    const rec = currUser;
    const formData = new FormData();
    formData.append("sender", sender);
    formData.append("receiver", rec);
    formData.append("file", values.file.path);
    formData.append("filename", values.file.name);
    if (values.file) {
      formData.append("file", values.file);
    }

    dispatch(sendUserMessage(formData));
    // console.log(formData);
    resetForm();
  };
  useEffect(() => {
    dispatch(messagedUser(user.userName));
  }, []);

  const amu = useSelector((state) => state.message.users);
  console.log(amu);
  const [currUser, setCurrUser] = useState("");
  const Navigate = useNavigate();
const handleChange = (e) => {
  setCurrUser(e.target.value);
};
  return (
    <Box>
      <Navbar/>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            p: 5,
            mr: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent:"center"
          }}
        >
          <Typography>Search</Typography>
          <InputBase
            sx={{
              borderRadius: "20px",
              padding: "0.5rem",
              border: "1px solid white",
            }}
            placeholder="Unique Name"
            onChange={handleChange}
            fullWidth
          />
          <Typography
            sx={{ fontWeight: "bolder", fontSize: "15px", p: "1rem" }}
          >
            Users
          </Typography>
          {amu.map((user, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem",justifyContent:"center",alignItems:"center",alignContent:'center' }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt="10px"
                  gap="1rem"
                  onClick={() => setCurrUser(user.userName)}
                  sx={{
                    "&:hover":{
                      cursor:"pointer"
                    }
                  }}
                >
                  <Avatar />
                  <Typography>{user.userName}</Typography>
                </Box>
                {/* <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap="0.8rem"
                >
                  <Avatar />
                  <Typography>{user.userName}</Typography>
                </Box> */}
              </Box>
            </React.Fragment>
          ))}
        </Box>
        <Box
          sx={{
            // bgcolor: "red",
            height: "500px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {currUser !== "" ? (
            <Box
              sx={{
                mt: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bolder", fontSize: "16px" }}>
                Send file to {currUser}
              </Typography>

              <Box width="500px">
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Dropzone
                        multiple={false}
                        onDrop={(acceptedFiles) => {
                          setFieldValue("file", acceptedFiles[0]);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            borderRadius="10px"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!values.file ? (
                              <Typography
                                component="p"
                                color={palette.primary.dark}
                              >
                                Click or Drop File Here!
                              </Typography>
                            ) : (
                              <FlexBetween sx={{ width: "100%", gap: "1rem" }}>
                                <Typography color={palette.primary.dark}>
                                  {values.file.name}
                                </Typography>
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Send
                      </Button>
                    </form>
                  )}
                </Formik>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{ mt: 40, fontWeight: "bolder", fontSize: "16px" }}
              >
                Send files to peoples
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
