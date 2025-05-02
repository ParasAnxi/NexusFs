/** IMPORTS */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import sessionStorage from "redux-persist/es/storage/session";
import userReducer from "../features/userSlice.js"
import messageReducer from "../features/messageSlice.js"

//** REDUCERS */
//** USERS */
const userPersistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["user", "token","mode"],
};
const messagePersistConfig = {
  key: "message",
  storage: storage,
  // whitelist: [],
};
//** COMBINE REDUCERS */
const reducers = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  message: persistReducer(messagePersistConfig, messageReducer),
});

//** CONFIG */
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
