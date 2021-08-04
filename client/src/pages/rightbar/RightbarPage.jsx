import "./rightbarPage.css"
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import axios from "axios"

const RightbarPage = () => {
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

    <div className="rightbarPage">
      <Topbar />
      {user && (
        <Rightbar user={user} />
      )}
      <Rightbar />
    </div>
  )
}

export default RightbarPage
