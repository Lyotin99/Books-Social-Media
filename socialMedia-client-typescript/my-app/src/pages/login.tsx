import React from "react";
import { Link } from "react-router-dom";
import "./login.css";
//MUI
import MenuBookIcon from "@material-ui/icons/MenuBook";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { Typography, TextField, Button } from "@material-ui/core";
//Redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
//Interfaces
import {
  LoginUIData,
  LoginErrorsData,
  UserData,
  History,
} from "../components/post/postInterfaces";

interface Props {
  loading?: boolean;
  loginUser: (
    userdata: {
      email: string;
      password: string;
    },
    history: History
  ) => void;
  UI: LoginUIData;
  user: UserData;
  history: History;
}
interface StateData {
  email: string;
  password: string;
  errors: LoginErrorsData;
}
export class Login extends React.Component<Props> {
  state: StateData = {
    email: "",
    password: "",
    errors: {},
  };

  static getDerivedStateFromProps(prevProps: Props, prevState: StateData) {
    if (prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (!prevProps.UI.errors && !prevProps.UI.loading) {
      return prevState;
    }

    return null;
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { errors } = this.state;
    const { UI } = this.props;

    return (
      <Grid
        container
        className="form"
        style={{ width: "70%", margin: "0 auto 0 auto", paddingTop: 30 }}
      >
        <Grid item sm />
        <Grid item sm>
          <MenuBookIcon
            color="primary"
            className="MenuBookIcon"
            style={{
              fontSize: 50,
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
            }}
          />
          <Typography
            variant="h1"
            className="pageTitle"
            style={{ fontSize: 60 }}
          >
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              error={errors?.password ? true : false}
              helperText={errors ? errors.email : ""}
              className="textfield-login"
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <p className="err">
              {errors && errors.error === "auth/invalid-email"
                ? "Email is invalid"
                : ""}
            </p>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className="textfield-login"
              error={errors?.password ? true : false}
              helperText={errors ? errors.password : ""}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <p className="err">{errors ? errors.general : ""}</p>
            <Button
              variant="contained"
              color="primary"
              id="btn"
              type="submit"
              disabled={UI.loading}
            >
              Login
              {UI.loading && <CircularProgress id="progress" size={30} />}
            </Button>
            <div style={{ marginTop: 10 }}>
              Don't have an account ? Sign up <Link to="/signup">here</Link>
            </div>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

const mapStateToProps = (state: Props) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = { loginUser };
export default connect(mapStateToProps, mapActionsToProps)(Login);
