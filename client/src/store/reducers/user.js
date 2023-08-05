import { createSlice } from "@reduxjs/toolkit";
import {
  dislikeSong,
  followArtist,
  isLoggedIn,
  likeSong,
  loginUser,
  signupUser,
  unfollowArtist,
} from "../thunks/user";

let DEFAULT_USER_STATE = {
  data: {
    _id: null,
    email: null,
    name: null,
    photo: null,
    role: null,
  },
  auth: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: DEFAULT_USER_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.auth = true;
      })
      // Sign up
      .addCase(signupUser.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.auth = true;
      })
      // Is auth
      .addCase(isLoggedIn.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.auth = true;
      })
      // Like song
      .addCase(likeSong.fulfilled, (state, action) => {
        state.data.likedSongs = action.payload;
      })
      // Dislike song
      .addCase(dislikeSong.fulfilled, (state, action) => {
        state.data.likedSongs = action.payload;
      })
      // Follow user
      .addCase(followArtist.fulfilled, (state, action) => {
        console.log("case follow", action.payload);
        state.data.followedUsers = action.payload;
      }) // Follow user
      .addCase(unfollowArtist.fulfilled, (state, action) => {
        console.log("case unfollow", action.payload);

        state.data.followedUsers = action.payload;
      });
  },
});

export default userSlice.reducer;
