import React, { Component } from "react";
//MUI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
//Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";
//Interfaces
import { OnePostData, CommentErrorsData, UIData } from "./postInterfaces";
interface Props {
  postId: string;
  user?: UserData;
  UI?: UIData;
  submitComment?: (postId: string, obj: { body: string }) => void;
  post: OnePostData;
}

interface StateToPropsData {
  user?: UserData;
  UI?: UIData;
  data: { post: OnePostData };
}

interface UserData {
  authenticated: boolean;
}
interface StateData {
  body: string;
  errors: CommentErrorsData;
}
class CommentForm extends Component<Props> {
  state: StateData = {
    body: "",
    errors: {},
  };

  static getDerivedStateFromProps(prevProps: Props, prevState: StateData) {
    if (prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (prevProps.UI && !prevProps.UI.errors && !prevProps.UI.loading) {
      const prevStateData = {
        body: prevState.body,
        errors: prevState.errors,
      };
      prevState.body = "";
      prevState.errors.comment = "";
      prevState.errors.general = "";
      return prevStateData;
    }

    return null;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.props.submitComment) {
      this.props.submitComment(this.props.postId, { body: this.state.body });
      if (this.state.body !== "") this.props.post.commentCount += 1;
      this.setState({
        body: "",
      });
    }
  };
  render() {
    const { user } = this.props;
    const { errors } = this.state;

    const commentFormMarkup =
      user && user.authenticated ? (
        <Grid item sm={12} style={{ textAlign: "center", marginTop: -30 }}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="Comment on post"
              error={errors.comment ? true : false}
              helperText={errors.comment}
              value={this.state.body}
              onChange={this.handleChange}
              fullWidth
              className="CommentFormTextField"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="CommentFormBtn"
              style={{ marginTop: 15 }}
            >
              Submit
            </Button>
          </form>
          <hr style={{ width: "100%", color: "rgba(0,0,0,0.1)" }} />
        </Grid>
      ) : (
        ""
      );
    return commentFormMarkup;
  }
}

const mapStateToProps = (state: StateToPropsData) => ({
  UI: state.UI,
  user: state.user,
  post: state.data.post,
});
export default connect(mapStateToProps, { submitComment })(CommentForm);
