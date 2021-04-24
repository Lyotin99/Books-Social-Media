import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//MUI

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
//Dayjs
import dayjs from "dayjs";
//Redux
import { connect } from "react-redux";
import { getReplies, PostReply } from "../../redux/actions/dataActions";
//Interfaces
import { Credentials, OnePostData, ReplyData } from "./postInterfaces";
import DeleteReply from "./DeleteReply";
import EditReply from "./EditReply";

interface Props {
  commentId: string;
  getReplies: (commentId: string) => void;
  PostReply: (commentId: string, replyData: ReplyDataForm) => void;
  credentials: Credentials;
  data: { post: OnePostData };
  index: number;
  repliesCount: number;
}
interface ReplyDataForm {
  body: string;
}

interface StateData {
  expanded: "panel1" | boolean;
  replyBarStatus: string;
  body: string;
}
export class CommentReply extends Component<Props> {
  state: StateData = {
    expanded: false,
    body: "",
    replyBarStatus:
      this.props.data.post.comments[this.props.index].repliesCount === 1
        ? `${
            this.props.data.post.comments[this.props.index].repliesCount
          } reply`
        : `${
            this.props.data.post.comments[this.props.index].repliesCount
          } replies`,
  };

  handleSubmitReplyInput = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    let reply: ReplyDataForm = {
      body: this.state.body,
    };

    if (this.props.PostReply) this.props.PostReply(this.props.commentId, reply);
    this.setState({ body: "" });
  };
  handleSubmit = () => {
    this.props.getReplies(this.props.commentId);
  };
  handleSubmitReply = () => {
    this.setState({
      expanded: "panel1",
      replyBarStatus: "Hide replies",
    });
    this.props.getReplies(this.props.commentId);
  };
  handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    if (newExpanded) {
      this.setState({
        expanded: panel,
        replyBarStatus: "Hide replies",
      });
    } else
      this.setState({
        expanded: false,
        replyBarStatus:
          this.props.data.post.comments[this.props.index].repliesCount === 1
            ? `${
                this.props.data.post.comments[this.props.index].repliesCount
              } reply`
            : `${
                this.props.data.post.comments[this.props.index].repliesCount
              } replies`,
      });
  };
  handleChangeReply = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const repliesMarkup =
      this.props.data.post.comments[this.props.index].replies &&
      this.props.data.post.comments[this.props.index].replies.length > 0 ? (
        this.props.data.post.comments[this.props.index].replies?.map(
          (reply: ReplyData) => {
            const {
              body,
              createdAt,
              userImage,
              username,
              replyId,
              commentId,
            } = reply;
            const deleteReplyBtn =
              this.props.credentials.username === username ? (
                <DeleteReply replyId={replyId} commentId={commentId} />
              ) : (
                ""
              );

            const editReply =
              this.props.credentials.username === username ? (
                <EditReply replyId={replyId} body={body} />
              ) : (
                ""
              );
            return (
              <Fragment key={reply.replyId}>
                <Grid
                  item
                  sm={12}
                  style={{ position: "relative", fontSize: "0.7rem" }}
                >
                  <Grid container spacing={0}>
                    <Grid item sm={2}>
                      <img
                        src={userImage}
                        alt="comment"
                        style={{
                          width: 40,
                          height: 40,
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
                        padding: 15,
                        marginLeft: -55,
                      }}
                    >
                      {deleteReplyBtn}
                      {editReply}
                      <div>
                        <Typography
                          variant="h5"
                          component={Link}
                          to={`/users/${username}`}
                          color="primary"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {username}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {typeof createdAt !== "number"
                            ? dayjs(
                                new Date(createdAt._seconds! * 1000)
                              ).format("h:mm a, MMMM DD YYYY")
                            : dayjs(new Date(createdAt * 1000)).format(
                                "h:mm a, MMMM DD YYYY"
                              )}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {body}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Fragment>
            );
          }
        )
      ) : this.props.data.post.comments[this.props.index].repliesCount > 0 ? (
        <CircularProgress />
      ) : (
        ""
      );

    const customReplyInput = this.props.credentials.username ? (
      <div style={{ display: "flex", marginTop: 10 }}>
        <div style={{ width: "10%" }}>
          <img
            src={this.props.credentials.imageUrl}
            alt="Profile"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ marginTop: 10, width: "88%" }}>
          <form onSubmit={this.handleSubmitReplyInput}>
            <TextField
              style={{
                width: "80%",
                height: "100%",
              }}
              name="body"
              value={this.state.body}
              placeholder="Write your reply here..."
              onChange={this.handleChangeReply}
              helperText="Press enter to send"
              rows={1}
              rowsMax={5}
            />
          </form>
        </div>
      </div>
    ) : (
      ""
    );
    return (
      <Fragment>
        <div
          onClick={this.handleSubmitReply}
          style={{ marginTop: -3, cursor: "pointer" }}
        >
          {this.props.credentials.username ? "Reply" : ""}
        </div>

        <div
          id="btn"
          onClick={this.handleSubmit}
          style={{
            border: "none",
            cursor: "default",
            width: "100%",
            padding: 0,
            marginTop: -15,
            backgroundColor: "transparent",
          }}
        >
          <Accordion
            elevation={0}
            style={{
              backgroundColor: "transparent",
            }}
            expanded={this.state.expanded === "panel1"}
            onChange={this.handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography style={{ fontSize: "0.8rem" }}>
                <span
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  {this.props.data.post.comments[this.props.index]
                    .repliesCount > 0
                    ? this.state.replyBarStatus
                    : ""}
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  width: "100%",
                  textAlign: "left",
                  wordWrap: "break-word",
                }}
              >
                {repliesMarkup}
                {customReplyInput}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  data: state.data,
  credentials: state.user.credentials,
});
export default connect(mapStateToProps, { getReplies, PostReply })(
  CommentReply
);
