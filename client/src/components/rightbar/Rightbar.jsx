import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove, Edit } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );
  const [editing, setEditing] = useState(false);
  const city = useRef();
  const from = useRef();
  const relationship = useRef();
  const [cityEditing, setCityEditing] = useState();
  const [fromEditing, setFromEditing] = useState();


  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id))
  }, [currentUser, user?._id, followed])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  // console.log("followed: " + followed);

  const editHandler = () => {
    setEditing(true);
    setCityEditing(user.city);
    setFromEditing(user.from);
  }

  const editProfileHandler = (e) => {

    console.log("edit submit")
    const updateUser = {
      userId: user._id,
      // password: user.password,
      city: city.current.value,
      from: from.current.value,
      relationship: relationship.current.value,
    };
    try {
      axios.put("/users/" + user._id, updateUser);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setEditing(false);
  }

  const cityHandler = (value) => {
    setCityEditing(value);
  }

  const fromHandler = (value) => {
    setFromEditing(value);
  }


  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Commet</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((user) => (
            <Online key={user.id} user={user} />
          ))}
        </ul>
      </>
    );
  };



  const ProfileRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <div className="flexContainer">
          <h4 className="rightbarTitle">User information</h4>
          <span className="profileEdit"><Edit htmlColor="Black" className="editIcon" onClick={editHandler} /></span>
        </div>

        {!editing && (
          <>
            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <span className="rightbarInfoValue">{user.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <span className="rightbarInfoValue">{user.from}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <span className="rightbarInfoValue">
                  {user.relationship === 1
                    ? "Single"
                    : user.relationship === 2
                      ? "Married"
                      : "-"}
                </span>
              </div>
            </div>
          </>
        )}

        {editing && (
          <>
            <form className="rightbarInfo" onSubmit={editProfileHandler}>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <input
                  value={cityEditing}
                  className=""
                  ref={city}
                  onChange={(e) => cityHandler(e.target.value)}
                />
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <input
                  value={fromEditing}
                  className=""
                  ref={from}
                  onChange={(e) => fromHandler(e.target.value)}
                />
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <select ref={relationship} name="relationship-menu" id="relationship-menu">
                  <option value="1">Single</option>
                  <option value="2">Married</option>
                  <option value="3"> - </option>
                </select>
              </div>
              <button onClick={() => setEditing(false)}>Cancel Editing</button>
              <button type="submit">Submit</button>
            </form>
          </>
        )}



        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend._id}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : `${PF}fish/noAvatar.jpg`
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}

        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}