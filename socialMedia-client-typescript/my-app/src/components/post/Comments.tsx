import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";
import CommentReply from "./CommentReply";
//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//Dayjs
import dayjs from "dayjs";
//Redux
import { connect } from "react-redux";
//Interfaces
import { OnePostData, CommentsData } from "./postInterfaces";
import CommentReplyForm from "./CommentReplyForm";

interface DataPost {
  data: { post: OnePostData };
  user: { credentials: { username: string } };
}

interface Props {
  comments: CommentsData[];
  post: OnePostData;
  user: { credentials: { username: string } };
}
class Comments extends Component<Props> {
  render() {
    const { comments } = this.props;

    return (
      <Grid container spacing={1}>
        {comments.map((comment: CommentsData, index) => {
          const {
            body,
            createdAt,
            userImage,
            username,
            commentId,
            repliesCount,
          } = comment;

          const deleteCommentBtn =
            this.props.user.credentials.username === username ? (
              <DeleteComment
                postId={this.props.post.postId}
                commentId={commentId}
              />
            ) : (
              ""
            );

          const editComment =
            this.props.user.credentials.username === username ? (
              <EditComment commentId={commentId} body={body} />
            ) : (
              ""
            );
          return (
            <Fragment key={index}>
              <Grid item sm={12} style={{ position: "relative" }}>
                <Grid
                  container
                  spacing={1}
                  style={{
                    paddingLeft: 25,
                  }}
                >
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt="comment"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    sm={9}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      marginBottom: 5,
                      borderRadius: 20,
                    }}
                  >
                    <div style={{ padding: 10, paddingLeft: 15 }}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${username}`}
                        color="primary"
                      >
                        {username}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {typeof createdAt !== "number"
                          ? dayjs(new Date(createdAt._seconds! * 1000)).format(
                              "h:mm a, MMMM DD YYYY"
                            )
                          : dayjs(new Date(createdAt * 1000)).format(
                              "h:mm a, MMMM DD YYYY"
                            )}
                      </Typography>
                      <Typography variant="body1">{body}</Typography>
                      <div style={{ position: "absolute", top: 15, right: 80 }}>
                        {deleteCommentBtn}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 15,
                          right: 105,
                        }}
                      >
                        {editComment}
                      </div>
                    </div>
                  </Grid>
                  <div
                    style={{
                      textAlign: "right",
                      width: "80%",
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: 150,
                    }}
                  >
                    {/* <CommentReplyForm /> */}
                    {repliesCount !== 0 ? (
                      <CommentReply
                        commentId={commentId}
                        index={index}
                        repliesCount={repliesCount}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </Grid>
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}
const mapStateToProps = (state: DataPost) => ({
  post: state.data.post,
  user: state.user,
});
export default connect(mapStateToProps)(Comments);
