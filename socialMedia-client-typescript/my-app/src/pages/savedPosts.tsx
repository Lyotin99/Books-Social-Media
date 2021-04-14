import React, { Component } from "react";
//REDUX
import { connect } from "react-redux";
import { getSavedPosts } from "../redux/actions/dataActions";
import {
  InitialStateData,
  OnePostData,
} from "../components/post/postInterfaces";
import Post from "../components/post/Post";
import PostSkeleton from "../util/PostSkeleton";
import { Grid } from "@material-ui/core";

interface Props {
  getSavedPosts: () => void;
  data: InitialStateData;
}

class savedPosts extends Component<Props> {
  state = {
    posts: {},
  };
  componentDidMount() {
    this.props.getSavedPosts();
  }
  render() {
    const { posts, loading } = this.props.data;

    let recentPostsMarkup = !loading ? (
      posts.map((post: OnePostData) => {
        return <Post key={post.postId} {...post} />;
      })
    ) : (
      <PostSkeleton />
    );
    return (
      <Grid
        container
        spacing={10}
        style={{ width: "60%", margin: "0 auto 0 auto", paddingTop: 30 }}
      >
        <Grid item md={10} xs={12}>
          {recentPostsMarkup}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: any) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getSavedPosts })(savedPosts);
