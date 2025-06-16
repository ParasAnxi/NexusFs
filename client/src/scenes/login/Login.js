//** IMPORTS */
import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import bg from '../../assets/bg1.webp'
import { userRegister, userLogin } from "../../features/userSlice";

//** EXISTS */
const getName = async (checkName) => {
  const sendData = {
    userName: checkName,
  };
  const response = await fetch("http://localhost:3001/find/user-name-exist", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
  const data = await response.json();
  return data.value;
};

const Login = () => {
  const [isLogin, setIsLogin] = useState("login");
  const dispatch = useDispatch();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const initialValues = {
    userName: "",
    password: "",
  };
  let validationSchema;
  
  if (isLogin) {
    validationSchema = Yup.object().shape({
      userName: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    });
  } else {
    validationSchema = Yup.object().shape({
      userName: Yup.string()
        .required("Username is required")
        .test(
          "unique-userName",
          "UserName already Exists!",
          async (userName) => {
            const data = await getName(userName);
            return !data;
          }
        ),
      password: Yup.string().required("Password is required"),
    });
  }

  const handleSubmit = (values,{resetForm}) => {
    if(isLogin === 'login'){
        dispatch(userLogin(values))
        resetForm();
    }
    else{
        dispatch(userRegister(values));
        setIsLogin('login');
        resetForm();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "400px",
          maxHeight: "400px",
          padding: "2rem",
          borderRadius: "16px",
          background: background,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
          {isLogin === "login" ? "Login" : "Register"}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="userName"
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue("userName", e.target.value);
                }}
                value={values.userName}
                onBlur={handleBlur}
                error={touched.userName && Boolean(errors.userName)}
                helperText={touched.userName && errors.userName}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {isLogin === "login" ? "Login" : "Register"}
              </Button>
            </form>
          )}
        </Formik>
        <Typography
          sx={{
            ":hover": {
              color: "blue",
              cursor: "pointer",
            },
            mt: "10px",
          }}
          onClick={() => {
            if (isLogin === "login") {
              setIsLogin("register");
            } else {
              setIsLogin("login");
            }
          }}
        >
          {isLogin === "login"
            ? "Don't have a account? sign up here!"
            : "Already have a account? Login here!"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
