import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyBtn from "../../util/MyBtn";
//MUI
import { Favorite, FavoriteBorder } from "@material-ui/icons";
//Redux
import { connect } from "react-redux";
import { likePost, unlikePost } from "../../redux/actions/dataActions";
//Interfaces
import { Posts, LikesData } from "./postInterfaces";

interface Props {
  likePost?: (postId: string) => void;
  unlikePost?: (postId: string) => void;
  postId: string;
  user: Posts;
}

export class LikeButton extends Component<Props> {
  likedPost = () => {
    if (
      this.props.user &&
      this.props.user.likes &&
      this.props.user.likes.find(
        (like: LikesData) => like.postId === this.props.postId
      )
    ) {
      return true;
    } else return false;
  };

  likePost = () => {
    if (this.props.likePost) this.props.likePost(this.props.postId);
  };
  unlikePost = () => {
    if (this.props.unlikePost) this.props.unlikePost(this.props.postId);
  };
  render() {
    const { user } = this.props;

    const likeButton =
      user && !user.authenticated ? (
        <Link to="/login">
          <MyBtn tip="Like">
            <FavoriteBorder color="primary" />
          </MyBtn>
        </Link>
      ) : this.likedPost() ? (
        <MyBtn tip="Unlike" onClick={this.unlikePost}>
          <Favorite color="primary" />
        </MyBtn>
      ) : (
        <MyBtn tip="Like" onClick={this.likePost}>
          <FavoriteBorder color="primary" />
        </MyBtn>
      );
    return likeButton;
  }
}
const mapActionsToProps = {
  likePost,
  unlikePost,
};
const mapStateToProps = (state: Props) => ({
  user: state.user,
});
export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
