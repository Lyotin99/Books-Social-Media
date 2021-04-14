import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Comments from "./Comments";
import MyBtn from "../../util/MyBtn";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import { EditPost } from "./EditPost";
//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Close } from "@material-ui/icons";
import { CircularProgress, Dialog, DialogContent } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { connect } from "react-redux";
import {
  getPost,
  cleanErrors,
  editPost,
} from "../../redux/actions/dataActions";
//Dayjs
import dayjs from "dayjs";
//Interfaces
import { OnePostData, UIData } from "./postInterfaces";
interface Props {
  postId: string;
  username: string;
  getPost: (postId: string) => void;
  likePost?: (postId: string) => void;
  unlikePost?: (postId: string) => void;
  cleanErrors?: () => void;
  editPost?: (postId: string, body: string) => void;
  post: OnePostData;
  UI: UIData;
  user?: {
    credentials: {
      username: string;
    };
  };
  openDialog?: boolean;
  likes?: number;
  comments?: number;
  body?: string;
}
interface StateToPropsData {
  data: { post: OnePostData };
  UI: UIData;
  user: {
    credentials: {
      username: string;
    };
  };
}

interface StateData {
  open: boolean;
  oldPath: string;
  newPath: string;
}
class PostDialog extends Component<Props> {
  state: StateData = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { username, postId } = this.props;
    const newPath = `/users/${username}/post/${postId}`;
    if (oldPath === newPath) oldPath = `/users/${username}`;
    window.history.pushState(null, "", newPath);
    this.setState({
      oldPath,
      newPath,
      open: true,
    });
    this.props.getPost(this.props.postId);
  };

  handleClose = () => {
    window.history.pushState(null, "", this.state.oldPath);
    this.setState({
      open: false,
    });

    if (this.props.cleanErrors) this.props.cleanErrors();
  };

  render() {
    const {
      post: { body, createdAt, postId, userImage, username },
      UI: { loading },
    } = this.props;

    const editBtn =
      this.props.user?.credentials.username === username ? (
        <EditPost
          postId={postId}
          body={body}
          editPost={this.props.editPost}
          UI={this.props.UI}
          cleanErrors={this.props.cleanErrors}
        />
      ) : (
        ""
      );

    const dialogMarkup = loading ? (
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 50 }}>
        <CircularProgress size={160} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={6} style={{ paddingBottom: 30 }}>
        <Grid item sm={5}>
          <img
            src={userImage}
            alt="Profile"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Grid>

        <Grid item sm={7} style={{ marginLeft: -115, position: "relative" }}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${username}`}
          >
            {username}
          </Typography>

          <div style={{ position: "absolute", top: 20, right: 1 }}>
            {editBtn}
          </div>

          <hr
            style={{
              border: "none",
              margin: 4,
            }}
          />
          <Typography variant="body2" color="textSecondary">
            {createdAt
              ? dayjs(createdAt._seconds! * 1000).format("h:mm a, MMMM DD YYYY")
              : ""}
          </Typography>
          <hr
            style={{
              border: "none",
              margin: 4,
            }}
          />
          <Typography variant="body1">{this.props.body}</Typography>
          <div
            className="likesAndComments"
            style={{
              display: "flex",
            }}
          >
            <div
              className="likes"
              style={{
                marginRight: 15,
                display: "flex",
                alignItems: "center",
              }}
            >
              <LikeButton postId={postId} />

              <span>{this.props.likes} likes</span>
            </div>
            <div
              className="comments"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <MyBtn tip="comments">
                <ChatIcon color="primary" />
              </MyBtn>
              <span>{this.props.post.commentCount} Comments</span>
            </div>
          </div>
        </Grid>

        <hr
          style={{
            width: "95%",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        />
        <CommentForm postId={postId} />
        <Comments comments={this.props.post.comments} />
      </Grid>
    );
    return (
      <Fragment>
        <MyBtn
          onClick={this.handleOpen}
          tip="Expand Post"
          btnClassName="expandBtn"
        >
          <ChatIcon color="primary" />
        </MyBtn>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <div style={{ position: "absolute", right: 20, top: 5 }}>
            <MyBtn tip="Close" onClick={this.handleClose}>
              <Close />
            </MyBtn>
          </div>
          <DialogContent
            className="dialogContent"
            style={{
              marginTop: 15,
            }}
          >
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}
const mapStateToProps = (state: StateToPropsData) => ({
  post: state.data.post,
  UI: state.UI,
  user: state.user,
});
const mapActionsToProps = {
  getPost,
  cleanErrors,
  editPost,
};
export default connect(mapStateToProps, mapActionsToProps)(PostDialog);
