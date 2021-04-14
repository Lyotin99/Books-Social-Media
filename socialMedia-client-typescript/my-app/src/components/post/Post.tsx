import React, { Component } from "react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import DeletePost from "./deletePost";
// import PostDialog from "./postDialog";
import MyBtn from "../../util/MyBtn";
//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";

//Dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//Redux
import { connect } from "react-redux";
//Interfaces
import { OnePostData, DateObj, Posts } from "./postInterfaces";
import SavedButton from "./savedButton";

const styles = {
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
  },
};

interface StateToPropsData {
  data: { post: OnePostData };
  user: Posts;
}
interface Props {
  body: string;
  createdAt: DateObj;
  username: string;
  postId: string;
  userImage: string;
  likeCount: number;
  imageUrl: string;
  commentCount: number;
  user: Posts;
  post?: OnePostData;
  likePost?: (postId: string) => void;
  unlikePost?: (postId: string) => void;
  openDialog?: boolean;
}

class Post extends Component<Props> {
  render() {
    const { body, createdAt, userImage, username, imageUrl } = this.props;
    const { user } = this.props;
    const userPostId = this.props.postId;

    const deleteButton =
      user.authenticated && username === user.credentials.username ? (
        <DeletePost postId={userPostId} />
      ) : null;

    const saveBtn = user.authenticated ? (
      <SavedButton postId={userPostId} />
    ) : null;
    dayjs.extend(relativeTime);
    return (
      <Card
        style={{
          position: "relative",
          display: "flex",
          marginBottom: 20,
        }}
      >
        <CardMedia
          style={styles.image}
          image={userImage}
          title="Profile Image"
        />
        <CardContent style={styles.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${username}`}
            color="primary"
          >
            {username}{" "}
          </Typography>

          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {createdAt && typeof createdAt !== "number"
              ? dayjs(new Date(createdAt._seconds * 1000)).fromNow()
              : dayjs(new Date(createdAt * 1000)).fromNow()}
          </Typography>
          <Typography variant="body1">{body ? body : imageUrl}</Typography>
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
              <LikeButton postId={userPostId} />
              <span>{this.props.likeCount} Likes</span>
            </div>
            <div
              className="comments"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link to={`/post/${userPostId}`}>
                <MyBtn tip="Expand Post">
                  <ChatIcon color="primary" />
                </MyBtn>
              </Link>
              {/* <PostDialog
                postId={userPostId}
                username={username}
                openDialog={this.props.openDialog}
                likes={this.props.likeCount}
                comments={this.props.commentCount}
                body={this.props.body}
              /> */}

              <span>
                {this.props.postId === this.props.post?.postId &&
                this.props.post.commentCount !== 0
                  ? this.props.post.commentCount
                  : this.props.commentCount}{" "}
                Comments
              </span>
            </div>
          </div>
        </CardContent>

        <div style={{ position: "absolute", bottom: 25, right: 21 }}>
          {saveBtn}
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state: StateToPropsData) => ({
  user: state.user,
  post: state.data.post,
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
