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

function App() {
  const mode = useSelector((state)=>state.user.mode);
  const theme = useMemo(()=>
  createTheme(themeSettings(mode)),[mode]);
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
