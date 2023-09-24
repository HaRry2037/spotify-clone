import "./Nav.scss";
import "./NavLibrary.scss";
import likedSongsImg from "../../img/likedSongs.jpeg";
import {
  IoHomeOutline,
  IoLibraryOutline,
  IoPersonCircleOutline,
  IoSearch,
} from "react-icons/io5";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = (props) => {
  // Redux
  const user = useSelector((state) => state.user.data);

  // Handlers
  const isArtist = (el) => el.role === "artist";

  return (
    <div className="nav">
      <div className="nav__block">
        <Link to={"/"} className="nav-link">
          <IoHomeOutline />
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-link">
          <IoSearch />
          <span>Search</span>
        </Link>
      </div>
      <div className="library">
        <div className="library__header">
          <IoLibraryOutline />
          <span>Library</span>
        </div>
        {user.id && (
          <div className="saved">
            <Link to="/likedSongs" className="saved__link">
              <img src={likedSongsImg} alt="Heart" />
              <span>📌 - Liked Songs</span>
            </Link>
            {[...user.likedPlaylists, ...user.followedArtists]
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((el) => (
                <NavLink
                  to={(isArtist(el) ? "/artist/" : "/playlist/") + el.id}
                  className={() => {
                    return `saved__link ${
                      isArtist(el) ? "saved__link--artist" : ""
                    } ${el.id === "650fffb62d99f057eff75b75" ? "vip" : ""}`;
                  }}
                >
                  <img src={el.img} alt={el.name} />
                  <span>{el.name}</span>
                </NavLink>
              ))}
          </div>
        )}
      </div>
      <div className="nav__block">
        <Link to="/profile" className="nav-link">
          <IoPersonCircleOutline />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
