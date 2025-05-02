import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Login from "./scenes/login/Login";
import Register from "./scenes/register/Register";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";
// import { themeSettings } from "./theme2";
import Home from "./scenes/home/Home";
import Message from "./scenes/message/Message";

const socket = io("http://localhost:3001");

function App() {
  const [file, setFile] = useState(null);
  const [userName, setuserName] = useState("");
  const [priority, setPriority] = useState(1);
  const [receivedFiles, setReceivedFiles] = useState([]);

  useEffect(() => {
    socket.on("receive-file", ({ filename, file }) => {
      const blob = new Blob([new Uint8Array(file)], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      setReceivedFiles((prev) => [...prev, { filename, url }]);
    });
  }, []);

  const handleRegister = () => {
    socket.emit("register", { userName, priority });
  };
  const mode = useSelector((state)=>state.user.mode);
  const theme = useMemo(()=>
  createTheme(themeSettings(mode)),[mode]);
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:3001/upload", formData);
    console.log("Stored at:", res.data.filePath);

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("send-file", {
        filename: file.name,
        file: reader.result,
      });
    };
    reader.readAsArrayBuffer(file);
  };
  const token = useSelector((state) => state.user.token);
  const auth = Boolean(useSelector((state) => state.user.token));
  // console.log(token);
  return (
    // <div style={{ padding: 30 }}>
    <div className="app">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={auth ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/home"
              element={auth ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/message/*"
              element={auth ? <Message /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
