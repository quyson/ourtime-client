import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import tokenSlice from "./slices/tokenSlice";

const reducer = combineReducers({
  user: userSlice,
  token: tokenSlice,
});

const store = configureStore({
  reducer: reducer,
});

export default store;