//** IMPORTS */
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";
//** COMPS */
import Login from "./scenes/login/Login";
import Home from "./scenes/home/Home";
import Message from "./scenes/message/Message";
import AllFiles from "./scenes/message/AllFiles";

function App() {
  const mode = useSelector((state)=>state.user.mode);
  const theme = useMemo(()=>
  createTheme(themeSettings(mode)),[mode]);
  // const token = useSelector((state) => state.user.token);
  const auth = Boolean(useSelector((state) => state.user.token));
  return (
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
              path="/allFile/:userName"
              element={auth ? <AllFiles /> : <Navigate to="/" />}
            />
            <Route
              path="/message"
              element={auth ? <Message /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
