import { Button, TextField, Tooltip } from "@material-ui/core";
import { TransferWithinAStation } from "@material-ui/icons";
import React, { Component, Fragment } from "react";
import MyBtn from "../../util/MyBtn";

export class CommentReplyForm extends Component {
  state = {
    clicked: false,
  };
  render() {
    console.log(this.state.clicked);
    return (
      <Fragment>
        <span
          style={{ fontSize: 10, cursor: "pointer" }}
          onClick={() => {
            this.setState({
              clicked: true,
            });
          }}
        >
          Reply
        </span>
        {this.state.clicked ? <TextField type="text" /> : ""}
      </Fragment>
    );
  }
}

export default CommentReplyForm;
