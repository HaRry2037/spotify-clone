import {createSlice} from "@reduxjs/toolkit";
import {getSong} from "../thunks/song";

export const songSlice = createSlice({
  name: 'song',
  initialState: {
    song: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // get song
    builder.addCase(getSong.fulfilled, (state, action) => {
      console.log(state, action.payload);
      state.song = action.payload;
    })
  }
})

export default songSlice.reducer;