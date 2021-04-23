import React, { Component } from "react";
import { Link } from "react-router-dom";
import Comments from "../components/post/Comments";
import MyBtn from "../util/MyBtn";
import LikeButton from "../components/post/LikeButton";
import CommentForm from "../components/post/CommentForm";
import { EditPost } from "../components/post/EditPost";
//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { CircularProgress } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
//Redux
import { connect } from "react-redux";
import { getPost, cleanErrors, editPost } from "../redux/actions/dataActions";
//Dayjs
import dayjs from "dayjs";
//Interfaces
import { OnePostData, UIData } from "../components/post/postInterfaces";
interface Props {
  match: {
    params: {
      username: string;
      postId: string;
    };
  };

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
class SinglePostPage extends Component<Props> {
  state: StateData = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    this.props.getPost(this.props.match.params.postId);
  }
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
      <Grid
        container
        spacing={6}
        style={{
          paddingBottom: 30,
          backgroundColor: "rgb(255, 255, 255)",
          width: "70%",
          margin: "0 auto",
          minWidth: 800,
        }}
      >
        <Grid style={{ alignSelf: "center", padding: 10 }}>
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

        <Grid
          item
          style={{
            width: "70%",
            position: "relative",
          }}
        >
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${username}`}
          >
            {username}
          </Typography>

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
          <Typography variant="body1">{body}</Typography>

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

              <span>{this.props.post.likeCount} likes</span>
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
            <div style={{ marginLeft: 20 }}>{editBtn}</div>
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
      <div
        style={{
          width: 1200,
          margin: "0 auto 0 auto",
          paddingTop: 30,
          marginBottom: 30,
        }}
      >
        {dialogMarkup}
      </div>
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
export default connect(mapStateToProps, mapActionsToProps)(SinglePostPage);
