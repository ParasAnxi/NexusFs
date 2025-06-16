//** IMPORTS */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import {
  Avatar,
  Box,
  Button,
  InputBase,
  LinearProgress,
  Typography,
} from "@mui/material";
import { messagedUser } from "../../features/messageSlice";
import Navbar from "../navbar/Navbar";
const socket = io("http://localhost:3001", { autoConnect: true });

const Message = () => {
  const user = useSelector((state) => state.user.user);

  const [sendMessage, setSendMessage] = useState(null);

  const [allMyFiles, setAllMyFiles] = useState([]);

  const dispatch = useDispatch();

  //** DATE TIME */
  function formatDT(input) {
    const date = new Date(input);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  /** INIT */
  const initialValues = {
    sender: "",
    receiver: "",
    file: null,
  };
  
  const [currUser, setCurrUser] = useState("");

  const [uploadMsg, setUploadMsg] = useState("");
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user?.userName) return;

    if (socket.connected) {
      socket.emit("addOnlineUsers", user.userName);
      // console.log("Sent username to server:", user.userName);
    } else {
      socket.on("connect", () => {
        socket.emit("addOnlineUsers", user.userName);
        // console.log("Socket connected and username sent:", user.userName);
      });
    }
  }, [user.userName]);

  const handleSubmit = async (values, { resetForm }) => {
    const sender = user.userName;
    const receiver = currUser;
    const formData = new FormData();
    const unqId = uuidv4();
    const date = formatDT(Date.now());
    formData.append("sender", sender);
    formData.append("receiver", receiver);
    formData.append("file", values.file);
    formData.append("unqId", unqId);
    formData.append("timeAt", date);
    // console.log(formData);
    const data = {
      unqId,
      sender,
      receiver,
      filename: values.file.name,
      file: values.file,
      timeAt: date,
    };
    // console.log(data);
    setSendMessage(data);
    socket.emit("sendMessage", data, (response) => {
      if (response.status === "ok") {
        setAllMyFiles((prev) => [data, ...prev]);
      }
    });
    setAllMyFiles((prev) => [data, ...prev]);
    setSendMessage(null);
    try {
      const response = await fetch("http://localhost:3001/message/sendfile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      // console.log("Upload success:", result);
      setUploadMsg(`Uploaded: ${result.fileId || "Success"}`);
      resetForm();
      setPreview("");
    } catch (error) {
      console.error("Upload failed", error);
      setUploadMsg("Upload failed");
    } finally {
      setProgress(0);
    }
  };
  useEffect(() => {
    dispatch(messagedUser(user.userName));
  }, []);

  const amu = useSelector((state) => state.message.users);

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setCurrUser(e.target.value);
  };
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            p: 5,
            mr: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt="10px"
                  gap="1rem"
                  onClick={() => setCurrUser(user.userName)}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
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
                mt: 10,
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
                  {({ values, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                      <Dropzone
                        multiple={false}
                        // accept={{ "image/*": [], "text/plain": [".txt"] }}
                        accept={{
                          "image/*": [],
                          "text/plain": [".txt"],
                          "application/pdf": [".pdf"],
                          "video/mp4": [".mp4"],
                          "application/msword": [".doc"],
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                            [".docx"],
                        }}
                        onDrop={(acceptedFiles) => {
                          const file = acceptedFiles[0];
                          setFieldValue("file", file);

                          if (file.type.startsWith("image/")) {
                            setPreview(URL.createObjectURL(file));
                          } else if (file.type === "text/plain") {
                            const reader = new FileReader();
                            reader.onload = () => setPreview(reader.result);
                            reader.readAsText(file);
                          } else {
                            setPreview(file.name);
                          }
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border="2px dashed #aaa"
                            borderRadius="10px"
                            p={2}
                            mt={2}
                            mb={2}
                            textAlign="center"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!values.file ? (
                              <Typography color="textSecondary">
                                Click or drag a .png/.jpg/.txt file here
                              </Typography>
                            ) : (
                              <Typography>{values.file.name}</Typography>
                            )}
                          </Box>
                        )}
                      </Dropzone>

                      {preview && (
                        <Box mt={2}>
                          {values.file?.type.startsWith("image/") ? (
                            <img
                              src={preview}
                              alt="Preview"
                              width="100%"
                              style={{ borderRadius: "8px" }}
                            />
                          ) : (
                            <Box
                              bgcolor="#f5f5f5"
                              p={2}
                              borderRadius="8px"
                              sx={{
                                whiteSpace: "pre-wrap",
                                maxHeight: 200,
                                overflow: "auto",
                              }}
                            >
                              <Typography variant="body2">{preview}</Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {progress > 0 && (
                        <Box mt={2}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                          />
                          <Typography variant="body2" mt={1}>
                            Uploading... {progress}%
                          </Typography>
                        </Box>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
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
