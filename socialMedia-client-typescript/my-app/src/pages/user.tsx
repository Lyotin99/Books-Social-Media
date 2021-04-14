import React, { Component } from "react";
import axios from "axios";
import PostSkeleton from "../util/PostSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
import StaticProfile from "../components/profile/StaticProfile";
import Post from "../components/post/Post";
//MUI
import Grid from "@material-ui/core/Grid";
//Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
//Interfaces
import {
  InitialStateData,
  OnePostData,
  Credentials,
} from "../components/post/postInterfaces";

interface isOpen {
  openDialog?: boolean;
}

interface AdditionalUserInfo {
  email: string;
  userId: string;
}
interface StateData {
  profile: (Credentials & AdditionalUserInfo) | null;
  postIdParam: string | null;
}
interface PropsData {
  getUserData: (username: string) => void;
  data: InitialStateData & isOpen;
  match: {
    params: {
      username: string;
      postId: string;
    };
  };
}
class user extends Component<PropsData> {
  state: StateData = {
    profile: null,
    postIdParam: null,
  };
  componentDidMount() {
    const username = this.props.match.params.username;
    const postId = this.props.match.params.postId;

    if (postId) {
      this.setState({
        postIdParam: postId,
      });
    }

    this.props.getUserData(username);
    axios
      .get(`/user/${username}`)
      .then((res) => {
        this.setState({
          profile: res.data.credentials,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { posts, loading } = this.props.data;
    const { postIdParam } = this.state;
    const postsMarkup = loading ? (
      <PostSkeleton />
    ) : posts === null ? (
      <p>No posts from this user</p>
    ) : !postIdParam ? (
      posts.map((post: OnePostData) => (
        <Post
          key={post.postId}
          body={post.body}
          createdAt={post.createdAt}
          username={post.username}
          imageUrl={post.imageUrl}
          postId={post.postId}
          userImage={post.userImage}
          commentCount={post.commentCount}
          likeCount={post.likeCount}
        />
      ))
    ) : (
      posts.map((post: OnePostData) => {
        if (post.postId !== postIdParam) {
          return (
            <Post
              key={post.postId}
              body={post.body}
              createdAt={post.createdAt}
              imageUrl={post.imageUrl}
              username={post.username}
              postId={post.postId}
              userImage={post.userImage}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
            />
          );
        } else {
          return (
            <Post
              key={post.postId}
              body={post.body}
              imageUrl={post.imageUrl}
              createdAt={post.createdAt}
              username={post.username}
              postId={post.postId}
              userImage={post.userImage}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              openDialog={true}
            />
          );
        }
      })
    );
    return (
      <Grid
        container
        spacing={10}
        style={{ width: "70%", minWidth: 1100, margin: "0 auto" }}
      >
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: PropsData) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getUserData })(user);
