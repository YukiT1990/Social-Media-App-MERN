import "./profile.css"
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios"
import { useParams } from "react-router"
import { Edit } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingUserImg, setEditingUserImg] = useState(false);
  const [editingCoverImg, setEditingCoverImg] = useState(false);
  const [userImgFile, setUserImgFile] = useState(null);
  const [coverImgFile, setCoverImgFile] = useState(null);
  const desc = useRef();
  const { user: currentUser } = useContext(AuthContext);

  const editDescHandler = () => {
    setEditingDesc(true);
  }

  const editProfileHandler = (e) => {
    console.log("edit submit")
    const updateUser = {
      userId: user._id,
      desc: desc.current.value,
    };
    try {
      axios.put("/users/" + user._id, updateUser);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setEditingDesc(false);
  }

  const submitUserImgHandler = async (e) => {
    e.preventDefault();
    let newUser = {
      userId: user._id,
    };
    if (userImgFile) {
      const data = new FormData();
      const fileName = Date.now() + userImgFile.name;
      newUser = {
        userId: user._id,
        profilePicture: fileName,
      };
      data.append("name", fileName);
      data.append("file", userImgFile);
      newUser.profilePicture = fileName;
      console.log(newUser);
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.put("/users/" + user._id, newUser);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setEditingUserImg(false);
  };

  const submitCoverImgHandler = async (e) => {
    e.preventDefault();
    let newUser = {
      userId: user._id,
    };
    if (coverImgFile) {
      const data = new FormData();
      const fileName = Date.now() + coverImgFile.name;
      newUser = {
        userId: user._id,
        coverPicture: fileName,
      };
      data.append("name", fileName);
      data.append("file", coverImgFile);
      newUser.coverPicture = fileName;
      console.log(newUser);
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.put("/users/" + user._id, newUser);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setEditingCoverImg(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    }
    fetchUser();
  }, [username]);

  // console.log("currentUser: " + JSON.stringify(currentUser, null, 2));

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

              <form className="shareBottom" onSubmit={submitCoverImgHandler}>
                <img
                  className="profileCoverImg"
                  src={user.coverPicture ? PF + user.coverPicture : PF + "fish/noCover.jpg"}
                  alt=""
                />
                <label htmlFor="coverImgFile">
                  {user._id === currentUser._id && (
                    <span className="coverImgEdit"><Edit htmlColor="Black" className="editImg" onClick={() => setEditingCoverImg(true)} /></span>
                  )}
                  <input
                    className="inputhide"
                    type="file"
                    id="coverImgFile"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => setCoverImgFile(e.target.files[0])}
                  />
                </label>
                {editingCoverImg && (
                  <div className="messageboardC">
                    {!coverImgFile && (
                      <p>File Name</p>
                    )}
                    {coverImgFile && (
                      <p>{coverImgFile.name}</p>
                    )}
                    <div className="buttons">
                      <button className="cancelButton" onClick={() => setEditingCoverImg(false)}>
                        Cancel
                      </button>
                      <button className="uploadButton" type="submit">
                        Upload Cover Image
                      </button>
                    </div>
                  </div>
                )}
              </form>


              <form className="shareBottom" onSubmit={submitUserImgHandler}>
                <img
                  className="profileUserImg"
                  src={user.profilePicture ? PF + user.profilePicture : PF + "fish/noAvatar.jpg"}
                  alt=""
                />
                <label htmlFor="userImgfile">
                  {user._id === currentUser._id && (
                    <span className="userImgEdit"><Edit htmlColor="Black" className="editImg" onClick={() => setEditingUserImg(true)} /></span>
                  )}

                  <input
                    className="inputhide"
                    type="file"
                    id="userImgfile"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => setUserImgFile(e.target.files[0])}
                  />
                </label>
                {editingUserImg && (
                  <div className="messageboardU">
                    {!userImgFile && (
                      <p>File Name</p>
                    )}
                    {userImgFile && (
                      <p>{userImgFile.name}</p>
                    )}
                    <div className="buttons">
                      <button className="cancelButton" onClick={() => setEditingUserImg(false)}>
                        Cancel
                      </button>
                      <button className="uploadButton" type="submit">
                        Upload Profile Image
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>


            {!editingDesc && (
              <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc ? user.desc : "Add description"}</span>
                {user._id === currentUser._id && (
                  <span className="descEdit"><Edit htmlColor="Black" className="editImg" onClick={() => editDescHandler()} /></span>
                )}

              </div>
            )}
            {editingDesc && (
              <form className="profileInfo" onSubmit={editProfileHandler}>
                <h4 className="profileInfoName">{user.username}</h4>
                <textarea
                  defaultValue={user.desc}
                  className="descForm"
                  ref={desc}
                />
                <div className="buttonsDesc">
                  <button className="cancelButton" onClick={() => setEditingDesc(false)}>Cancel</button>
                  <button className="uploadButton" type="submit">Submit</button>
                </div>
              </form>
            )}
          </div>

          {user._id !== currentUser._id && (
            <div className="rightbarContainerForSmallscreen">
              <Rightbar user={user} />
            </div>
          )}

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
