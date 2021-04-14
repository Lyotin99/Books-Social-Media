import React from "react";
import "./login.css";
import { Link } from "react-router-dom";
//MUI
import MenuBookIcon from "@material-ui/icons/MenuBook";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { Typography, TextField, Button } from "@material-ui/core";
//Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
//Interfaces
import {
  SignupUIData,
  SignupErrorsData,
  UserData,
  History,
} from "../components/post/postInterfaces";

interface SignupProps {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  loading?: boolean;
  errors?: SignupErrorsData;
  signupUser: (
    userdata: {
      email: string;
      password: string;
      confirmPassword: string;
      username: string;
    },
    history: History
  ) => void;
  UI?: SignupUIData;
  user?: UserData;
  history?: History;
}

export class Signup extends React.Component<SignupProps> {
  state: SignupProps = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    errors: {},
    signupUser: () => {},
  };
  static getDerivedStateFromProps(
    prevProps: SignupProps,
    prevState: SignupProps
  ) {
    if (prevProps.UI && prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (prevProps.UI && !prevProps.UI.errors && !prevProps.UI.loading) {
      return prevState;
    }

    return null;
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username,
    };

    if (this.props.history)
      this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const { errors } = this.state;
    const loading = this.props.UI?.loading;

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
            Signup
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
              id="username"
              name="username"
              type="username"
              label="Username"
              error={errors?.username ? true : false}
              helperText={errors ? errors.username : ""}
              className="textfield-login"
              value={this.state.username}
              onChange={this.handleChange}
              fullWidth
            />

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
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              className="textfield-login"
              error={errors?.confirmPassword ? true : false}
              helperText={errors ? errors.confirmPassword : ""}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
            />
            <p className="err">{errors ? errors.general : ""}</p>
            <Button
              variant="contained"
              color="primary"
              id="btn"
              type="submit"
              disabled={loading}
            >
              Signup
              {loading && <CircularProgress id="progress" size={30} />}
            </Button>
            <div style={{ marginTop: 10 }}>
              Already have an account ? Login <Link to="/login">here</Link>
            </div>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

const mapStateToProps = (state: SignupProps) => ({
  user: state.user,
  UI: state.UI,
});
export default connect(mapStateToProps, { signupUser })(Signup);
