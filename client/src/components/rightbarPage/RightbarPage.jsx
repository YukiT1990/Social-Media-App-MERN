import "./rightbarPage.css"
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const RightbarPage = () => {
  const { user } = useContext(AuthContext);

  return (

    <div className="rightbarPageC">
      {user && (
        <Rightbar user={user} />
      )}
      <Rightbar />
    </div>
  )
}

export default RightbarPage
