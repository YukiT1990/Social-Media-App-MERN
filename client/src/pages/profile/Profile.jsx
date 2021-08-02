import "./profile.css"
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios"
import { useParams } from "react-router"
import { Edit } from "@material-ui/icons";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    }
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="sidebarContainerProfile">
          <Sidebar />
        </div>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF + "fish/noCover.jpg"}
                alt=""
              />
              <span className="coverImgEdit"><Edit htmlColor="Black" className="editImg" /></span>
              <img
                className="profileUserImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "fish/noAvatar.jpg"}
                alt=""
              />
              <span className="userImgEdit"><Edit htmlColor="Black" className="editImg" /></span>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <div className="feedContainerProfile">
              <Feed username={username} />
            </div>
            <div className="rightbarContainerProfile">
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
