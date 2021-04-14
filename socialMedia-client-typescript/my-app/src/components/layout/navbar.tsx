import { Fragment } from "react";
import { Link } from "react-router-dom";
import MyBtn from "../../util/MyBtn";
import CreatePost from "../post/CreatePost";
import Notifications from "./Notifications";

//Redux
import { connect } from "react-redux";
//MUI imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import SaveIcon from "@material-ui/icons/Save";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
interface Props {
  authenticated: boolean;
}
interface StateData {
  user: {
    authenticated: boolean;
  };
}
function navbar(props: Props) {
  const { authenticated } = props;
  return (
    <AppBar>
      <Toolbar className="nav-container">
        {authenticated ? (
          <Fragment>
            <CreatePost />
            <Link to="/">
              <MyBtn tip="Home">
                <HomeIcon />
              </MyBtn>
            </Link>

            <Notifications />
            <Link to="/users/saved/">
              <MyBtn tip="Saved posts">
                <SaveIcon />
              </MyBtn>
            </Link>
            <Link to="/library">
              <MyBtn tip="Check for books">
                <LibraryBooksIcon />
              </MyBtn>
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
            <Link to="/library">
              <MyBtn tip="Check for books">
                <LibraryBooksIcon />
              </MyBtn>
            </Link>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
}
const mapStateToProps = (state: StateData) => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps)(navbar);
