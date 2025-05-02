import React from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "./../../components/FlexBetween";
import { sendUserMessage } from "../../features/messageSlice";
const Message = () => {
  const user = useSelector((state) => state.user.user);
  console.log(user.sender);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const initialValues = {
    sender: "",
    receiver: "",
    // file: null
  };

  const handleSubmit = (values) => {
    const sender = user.userName;
    const rec = "seochan";
    const formData = new FormData();
    formData.append("sender", sender);
    formData.append("receiver", rec);
    formData.append("file",values.file.path);
    formData.append("filename",values.file.name)
    if (values.file) {
      formData.append("file", values.file);
    }

    dispatch(sendUserMessage(formData));
    // console.log(formData);
  };
  const Navigate = useNavigate();
  return (
    <Box>
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
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
                      <Typography component="p" color={palette.primary.dark}>
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
  );
};

export default Message;
