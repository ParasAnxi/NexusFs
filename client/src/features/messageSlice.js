//** IMPORTS */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//** API */
const MESSAGE_API = "http://localhost:3001/message";
//** CONFIG */
const initialState = {
  users: [],
  status: "idle",
  chats: [],
};
//** GET MESSAGED USERS */
export const messagedUser = createAsyncThunk(
  "/message/getmessagedpeople",
  async (userName) => {
    const response = await fetch(`${MESSAGE_API}/getmessagedpeople`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userName }),
    });
    const data = await response.json();
    // console.log(data);
    return data;
  }
);
//** SEND MESSAGE */
export const sendUserMessage = createAsyncThunk(
  "/message/sendmessage",
  async (messageData) => {
    const response = await fetch(`${MESSAGE_API}/sendmessage`, {
      method: "POST",
      body: messageData,
    });
    const data = await response.json();
    // console.log(data);
    return data;
  }
);
export const getFiles = createAsyncThunk("/message/getFiles",async(data)=>{
  const response = await fetch(`${MESSAGE_API}/getchats`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  // console.log(res);
  return res;
})
//** REDUCERS */
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    onMessageLogOut: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(messagedUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(messagedUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload.users;
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.status = "idle";
        state.chats = action.payload.messages;
      });
  },
});

export const { onMessageLogOut } = messageSlice.actions;
export default messageSlice.reducer;
