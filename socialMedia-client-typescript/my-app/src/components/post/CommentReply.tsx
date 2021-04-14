import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//MUI

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Grid,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
//Dayjs
import dayjs from "dayjs";
//Redux
import { connect } from "react-redux";
import { getReplies } from "../../redux/actions/dataActions";
//Interfaces
import { OnePostData, ReplyData } from "./postInterfaces";

interface Props {
  commentId: string;
  getReplies: (commentId: string) => void;
  data: { post: OnePostData };
  index: number;
  repliesCount: number;
}

interface StateData {
  expanded: "panel1" | boolean;
  replyBarStatus: string;
}
export class CommentReply extends Component<Props> {
  state: StateData = {
    expanded: false,
    replyBarStatus:
      this.props.repliesCount === 1
        ? `${this.props.repliesCount} reply`
        : `${this.props.repliesCount} replies`,
  };
  handleSubmit = () => {
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
          this.props.repliesCount === 1
            ? `${this.props.repliesCount} reply`
            : `${this.props.repliesCount} replies`,
      });
  };

  render() {
    const repliesMarkup = this.props.data.post.comments[this.props.index]
      .replies ? (
      this.props.data.post.comments[this.props.index].replies?.map(
        (reply: ReplyData) => {
          const { body, createdAt, userImage, username } = reply;
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
                          ? dayjs(new Date(createdAt._seconds! * 1000)).format(
                              "h:mm a, MMMM DD YYYY"
                            )
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
    ) : (
      <CircularProgress />
    );
    return (
      <Fragment>
        <button
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
                  {this.state.replyBarStatus}
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
              </div>
            </AccordionDetails>
          </Accordion>
        </button>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getReplies })(CommentReply);
