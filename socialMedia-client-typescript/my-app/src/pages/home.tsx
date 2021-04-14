import React from "react";
import PostSkeleton from "../util/PostSkeleton";
import Profile from "../components/profile/Profile";

//MUI
import Grid from "@material-ui/core/Grid";
import Post from "../components/post/Post";
//Redux
import { connect } from "react-redux";
import { getPosts } from "../redux/actions/dataActions";
//Interfaces
import {
  OnePostData,
  DateObj,
  InitialStateData,
} from "../components/post/postInterfaces";

interface Props {
  body: string;
  createdAt: DateObj;
  username: string;
  postId: string;
  likeCount: number;
  commentCount: number;
  userImage: string;
  getPosts: () => void;
  data: InitialStateData;
}

class Home extends React.Component<Props> {
  componentDidMount() {
    this.props.getPosts();
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
        style={{
          width: "70%",
          maxWidth: 1200,
          minWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: Props) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getPosts })(Home);
