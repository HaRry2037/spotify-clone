import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async (id) => {
    try {
      // const res = await axios.get(`/playlists/${id}`);
      const res = await axios.get(`/playlists/${id}`);
      console.log(res);

      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  },
);
