import React, { useState, useEffect } from 'react'
import Topbar from "../../components/topbar/Topbar";
// import Sidebar from "../../components/sidebar/Sidebar";
import Post from "../../components/post/Post";
// import Rightbar from "../../components/rightbar/Rightbar";
import { useLocation } from "react-router-dom"
import axios from "axios";

const TargetPost = () => {
  const location = useLocation();
  const [postid, setPostid] = useState(location.pathname.substring(6));
  const [post, setPost] = useState();

  useEffect(() => {
    const getTargetPost = async () => {
      try {
        const result = await axios.get("/posts/" + postid);
        setPost(result.data);

      } catch (err) {
        console.log(err);
      }
    };
    getTargetPost();
  }, [postid])

  useEffect(() => {
    setPostid(location.pathname.substring(6));
  }, [location.pathname])

  console.log("postid: " + postid);

  return (
    <div className="targetPostPage">
      <Topbar />
      {post && (
        <Post post={post} />
      )}
    </div>
  )
}

export default TargetPost
