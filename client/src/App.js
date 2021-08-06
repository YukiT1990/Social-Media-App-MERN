import Home from "./pages/home/Home"
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import RightbarPage from "./pages/rightbar/RightbarPage";
import TargetPost from "./pages/targetPost/TargetPost";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
const WIDTH_THRESHOLD_MEDIUM = 800;

function App() {
  const { user } = useContext(AuthContext);
  const [width, setWidth] = useState(null)
  const updateWidth = (event) => {
    setWidth(window.innerWidth)
  }


  useEffect(() => {
    window.addEventListener(`resize`, updateWidth, {
      capture: false,
      passive: true,
    })
    return () => window.removeEventListener(`resize`, updateWidth)
  })

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/profile/:username">
          {user ? <Profile /> : <Redirect to="/login" />}
        </Route>
        <Route path="/rightbar/:username">
          {user ? (width < WIDTH_THRESHOLD_MEDIUM ? <RightbarPage /> : <Profile />) : <Redirect to="/login" />}
        </Route>
        <Route path="/post/:postid">
          {user ? <TargetPost /> : <Register />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
