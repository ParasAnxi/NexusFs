//** IMPORTS */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//** API */
const USER_API = "http://localhost:3001/auth";
//** CONFIG */
const initialState = {
  user: null,
  token: null,
  status: "idle",
  mode:"light",
};
//** LOGIN */
export const userLogin = createAsyncThunk("auth/login", async (data) => {
  const response = await fetch(`${USER_API}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const userData = await response.json();
  return userData;
});
//** REGISTER */
export const userRegister = createAsyncThunk("auth/register", async (user) => {
  const response = await fetch(`${USER_API}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
});

//** REDUCERS */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogOut: (state) => {
      state.user = null;
      state.token = null;
    },
    setMode:(state)=>{
      state.mode = state.mode === "light" ? "dark" : "light";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(userRegister.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.status = "idle";
      })
  },
});

export const { setLogOut, setMode } = userSlice.actions;
export default userSlice.reducer;
