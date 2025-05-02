// src/pages/Register.js
import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values) => {
    console.log("Register values:", values);
    // Call your API here
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 10 }}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="userName"
              value={values.userName}
              onChange={handleChange}
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
              Register
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
