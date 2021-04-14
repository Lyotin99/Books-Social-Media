// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";

//Redux

import { Provider } from "react-redux";
import store from "./redux/store";
// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import booksCollection from "./pages/booksCollection";
import Navbar from "./components/layout/navbar";
import user from "./pages/user";
import AuthRoute from "./util/AuthRoute";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
import axios from "axios";
import savedPosts from "./pages/savedPosts";
import SinglePostPage from "./pages/SinglePostPage";
axios.defaults.baseURL =
  "https://europe-west1-social-media-backend-41ded.cloudfunctions.net/api";
interface JwtExp {
  exp?: number;
}
// interface history {
//   history?: {
//     push(url: string): void;
//   };
// }

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#7986cb",
      main: "#ff4400",
      dark: "#303f9f",
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      contrastText: "#ffcc00",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const token: string = localStorage.FBIdToken;

// const obj: history = {};
if (token) {
  const decodedToken: JwtExp = jwtDecode(token);
  let expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0;

  if (expirationTime <= Date.now()) {
    store.dispatch(logoutUser());
    window.location.pathname = "/";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });

    store.dispatch(getUserData());
  }
}
function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login} />
              <AuthRoute exact path="/signup" component={signup} />
              <Route exact path="/users/saved" component={savedPosts} />
              <Route exact path="/users/:username" component={user} />
              <Route
                exact
                path="/users/:username/post/:postId"
                component={user}
              />
              <Route exact path="/post/:postId" component={SinglePostPage} />
              <Route exact path="/library" component={booksCollection} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
