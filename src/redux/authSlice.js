import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoggedIn: !!Cookies.get("token"), // check cookie initially
  user: JSON.parse(localStorage.getItem("user")) || null, // fallback to localStorage
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;

      // ✅ Save to localStorage for refresh persistence
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.user = null;

      // ✅ Clear localStorage on logout
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
