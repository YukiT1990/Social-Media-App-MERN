import React from 'react'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainerH">
        <div className="sidebarContainerH">
          <Sidebar />
        </div>
        <div className="feedContainerH">
          <Feed />
        </div>
        <div className="rightbarContainerH">
          <Rightbar />
        </div>
      </div>
    </>
  )
}
