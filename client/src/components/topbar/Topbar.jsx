import "./topbar.css";
import { Search, Person, Chat, Notifications, MenuOpen, Menu, Close } from "@material-ui/icons";
import { Link } from "react-router-dom"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searching, setSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState();


  const logoutHandler = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <div className="sidebarIcon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {!sidebarOpen && (
              <Menu />
            )}
            {sidebarOpen && (
              <Close />
            )}
          </div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Under The Water</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
            />
          </div>
          <div className="searchIconForSmallScreen">
            <Search className="searchIcon" onClick={() => setSearching(!searching)} style={{ textDecoration: "none", color: "white" }} />

          </div>

        </div>
        <div className="topbarRight">
          <div className="topbarLinks">

            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="topbarLink">Homepage</span>
            </Link>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none" }}>
              <span className="topbarLink">Timeline</span>
            </Link>
            {user &&
              <span className="topbarLink" onClick={logoutHandler}>Logout</span>
            }
            {!user &&
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="topbarLink">Login</span>
              </Link>
            }
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
          </div>
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "fish/noAvatar.jpg"
              }
              alt=""
              className="topbarImg"
            />
          </Link>
          <div className="smallscreen">
            <Link to={`/rightbar/${user.username}`} style={{ textDecoration: "none", color: "white" }}>
              <MenuOpen />
            </Link>

          </div>
        </div>
      </div>
      {searching && (
        <div className="searchInputForSmallScreen">
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      )}
      {sidebarOpen && (
        <Sidebar className="sidebar" />
      )}
    </>
  );
}
