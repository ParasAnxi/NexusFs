//** IMPORTS */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../features/messageSlice";
import { Box, Button, IconButton, Typography, Modal } from "@mui/material";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//** SOCCKETS */
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", { autoConnect: true });

const AllFiles = () => {
  const [myFiles, showMyfiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [messages, setMessages] = useState([]);

  const { userName } = useParams();
  const user = useSelector((state) => state.user.user);
  const allFiles = useSelector((state) => state.message.chats);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      sender: user.userName,
      receiver: userName,
    };
    dispatch(getFiles(data));
  }, [dispatch, user.userName, userName]);

  useEffect(() => {
    setMessages(allFiles);
  }, [allFiles]);

  const handleFileClick = async (file) => {
    try {
      const fileId = file.unqId;
      const res = await fetch(`http://localhost:3001/message/${fileId}`);
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const updatedFile = { ...file, fileUrl: blobUrl };
      setSelectedFile(updatedFile);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching file:", error);
      setSelectedFile(null);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
  };

  const renderFilePreview = (file) => {
    const ext = file.filename.split(".").pop().toLowerCase();
    const fileUrl = file.fileUrl;

    if (["doc", "docx", "pdf", "xlsx"].includes(ext)) {
      return (
        <Box
          sx={{
            height: "75vh",
            width: "100%",
            overflow: "hidden",
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <DocViewer
            style={{ height: "100%", width: "100%" }}
            documents={[
              { uri: fileUrl, fileType: ext, fileName: file.filename },
            ]}
            pluginRenderers={DocViewerRenderers}
            config={{
              header: {
                disableHeader: false,
                disableFileName: false,
              },
            }}
          />
        </Box>
      );
    }
    if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) {
      return (
        <img src={fileUrl} alt={file.filename} style={{ maxWidth: "100%" }} />
      );
    }
    if (["mp4", "webm", "ogg"].includes(ext)) {
      return (
        <video controls style={{ maxWidth: "100%" }}>
          <source src={fileUrl} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    if (["mp3", "wav"].includes(ext)) {
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={fileUrl} type={`audio/${ext}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    if (["txt", "md", "json", "csv", "log"].includes(ext)) {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) => setTextContent(text))
        .catch(() => setTextContent("Unable to load file content."));
      return (
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "#000",
            color: "#fff",
            p: 2,
            borderRadius: 1,
          }}
        >
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.95rem",
              margin: 0,
            }}
          >
            {textContent}
          </pre>
        </Box>
      );
    }
    return <Typography>Preview not supported for this file type.</Typography>;
  };

  function formatDT(isoString) {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

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
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      const fileTypes = [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "bmp",
        "webp",
        "mp4",
        "mp3",
        "wav",
        "doc",
        "docx",
        "pdf",
        "txt",
        "xlsx",
      ];
      const isFile = fileTypes.includes(
        data.filename.split(".").pop().toLowerCase()
      );

      if (
        isFile &&
        ((data.sender === userName && data.receiver === user.userName) ||
          (data.receiver === userName && data.sender === user.userName))
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user.userName, userName]);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          p: "1rem",
          justifyContent: "space-between",
          width: "300px",
        }}
      >
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {selectedFile?.filename}
            </Typography>
            {selectedFile && renderFilePreview(selectedFile)}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedFile.fileUrl;
                  link.download = selectedFile.filename;
                  link.click();
                }}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                color="error"
                
                onClick={async () => {
                  try {
                    const fileId = selectedFile.unqId
                    await fetch(`http://localhost:3001/message/${fileId}`, {
                      method: "DELETE",
                    });
                    setMessages((prev) =>
                      prev.filter((f) => (f.unqId) !== fileId)
                    );
                    handleCloseModal();
                  } catch (err) {
                    console.error("Delete failed", err);
                  }
                }}
              >
                Delete
              </Button>
            </Box>
            <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>

        <Typography sx={{ p: "1rem", fontSize: "16px", fontWeight: "bold" }}>
          {!myFiles ? "Show All Files" : "Show received Files"}
        </Typography>
        <IconButton onClick={() => showMyfiles((prev) => !prev)}>
          {myFiles ? <ToggleOnOutlinedIcon /> : <ToggleOffOutlinedIcon />}
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", p: "1rem", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            m: "10px 100px",
          }}
        >
          {!myFiles ? (
            <>
              <Typography>FileName</Typography>
              <Typography>Time</Typography>
            </>
          ) : (
            <>
              <Typography>FileName</Typography>
              <Typography>Time</Typography>
            </>
          )}
        </Box>

        {messages
          .filter(
            (file) =>
              (!myFiles && file.sender !== user.userName) ||
              (myFiles && file.sender === user.userName)
          )
          .map((file, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                p: "1rem",
                justifyContent: "space-between",
                mx: "70px",
                "&:hover": { cursor: "pointer", color: "red" },
              }}
              onClick={() => handleFileClick(file)}
            >
              {myFiles ? (
                <>
                  <Typography>{file.filename}</Typography>
                  <Typography>{file.timeAt}</Typography>
                </>
              ) : (
                <>
                  <Typography>{file.filename}</Typography>
                  <Typography>{file.timeAt}</Typography>
                </>
              )}
            </Box>
          ))}
      </Box>
    </>
  );
};

export default AllFiles;
