import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: { currentToken: null },
  reducers: {
    setToken: (state, action) => {
      state.currentToken = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;