import "./Playlist.scss";
import { IoPauseCircle } from "react-icons/io5";
import { useEffect } from "react";
import { getPlaylist } from "../../../store/thunks/playlist";
import { useDispatch, useSelector } from "react-redux";
import List from "../../UI/List";

const Playlist = () => {
  // Redux
  const { playlist } = useSelector((state) => state.playlist);

  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    dispatch(getPlaylist());
  }, []);

  return (
    <>
      {playlist ? (
        <div className="playlist">
          <div className="playlist__header">
            <div className="playlist__image">
              <img
                src="https://images.unsplash.com/photo-1653299832314-5d3dc1e5a83c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80"
                alt="Playlist cover"
              />
            </div>
            <div className="playlist__info">
              <p className="playlist__info--type">Playlist</p>
              <h1 className="playlist__name">{playlist.name}</h1>
              <div></div>
              <p>👨 * Maqsud Tolipov * 46 songs</p>
            </div>
          </div>

          <div className="playlist-nav">
            <IoPauseCircle />
          </div>

          <div className="playlist__songs">
            <List list={playlist.songs} />
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </>
  );
};

export default Playlist;
