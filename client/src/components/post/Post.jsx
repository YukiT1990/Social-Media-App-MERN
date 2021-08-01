import "./post.css";
import { MoreVert } from "@material-ui/icons";
import React, { useContext, useRef, useEffect, useState } from "react";
import axios from "axios"
import { format } from "timeago.js"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const desc = useRef();
  const [editing, setEditing] = useState(false);
  const [descEditing, setDescEditing] = useState();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    }
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) { }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editingHandler = () => {
    setDescEditing(post?.desc);
    handleClose();
    setEditing(true);
  }

  const updateHandler = () => {
    const updatePost = {
      userId: currentUser._id,
      desc: desc.current.value,
    }
    try {
      axios.put("/posts/" + post._id, updatePost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setEditing(false);
  };

  const deleteHandler = () => {
    try {
      axios.delete("/posts/" + post._id, { userId: currentUser._id });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const changeHandler = (value) => {
    setDescEditing(value);
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : `${PF}fish/noAvatar.jpg`
                }
                alt=""
              />
            </Link>
            <span className="postUsername">
              {user.username}
              {/* <p>{"post._id: " + post._id}</p>
              <p>{"currentUser._id: " + currentUser._id}</p> */}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {user._id === currentUser._id && (
              <>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <MoreVert />
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={editingHandler}>Edit</MenuItem>
                  <MenuItem onClick={deleteHandler}>Delete</MenuItem>
                  <MenuItem onClick={handleClose}>Close</MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
        <div className="postCenter">
          {!editing && (
            <span className="postText">{post?.desc}</span>
          )}
          {editing && (
            <>
              <form onSubmit={updateHandler} className="updateForm">
                <input
                  value={descEditing}
                  className="postEdit"
                  ref={desc}
                  onChange={(e) => changeHandler(e.target.value)}
                />
                <button className="updateButoon" type="submit">
                  Update
                </button>
              </form>
              <button onClick={() => setEditing(false)} className="cancelButton">Cancel Editing</button>
            </>
          )}

          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} fish like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}