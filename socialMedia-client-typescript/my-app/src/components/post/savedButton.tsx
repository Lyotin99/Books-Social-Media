import React from "react";
import MyBtn from "../../util/MyBtn";
//MUI
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
//REDUX
import { connect } from "react-redux";
import { savePost, unSavePost } from "../../redux/actions/dataActions";
//Interfaces
import { Posts } from "./postInterfaces";
interface Props {
  postId: string;
  savePost?: (postId: string) => void;
  unSavePost?: (postId: string) => void;
  user: Posts;
}

class SaveButton extends React.Component<Props> {
  savedPost = () => {
    if (
      this.props.user.savedPosts.find(
        (savedPost: any) => savedPost.postId === this.props.postId
      )
    ) {
      return true;
    } else return false;
  };

  likePost = () => {
    if (this.props.savePost) this.props.savePost(this.props.postId);
  };
  unlikePost = () => {
    if (this.props.unSavePost) this.props.unSavePost(this.props.postId);
  };
  render() {
    const savedBtn = this.savedPost() ? (
      <MyBtn tip="Unsave post" onClick={this.unlikePost}>
        <BookmarkIcon color="primary" fontSize="small" />
      </MyBtn>
    ) : (
      <MyBtn tip="Save post" onClick={this.likePost}>
        <BookmarkBorderIcon color="primary" fontSize="small" />
      </MyBtn>
    );
    return savedBtn;
  }
}
const mapActionsToProps = {
  savePost,
  unSavePost,
};
const mapStateToProps = (state: Props) => ({
  user: state.user,
});
export default connect(mapStateToProps, mapActionsToProps)(SaveButton);
