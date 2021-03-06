import React, { Component, Fragment } from "react";
import { editComment, cleanErrors } from "../../redux/actions/dataActions";
//MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
//Redux
import { connect } from "react-redux";

interface mapStateToPropsData {
  UI: { errors: { error: string } };
}
interface StateData {
  open: boolean;
  body: string;
  errors: { error: string };
}
interface CommentData {
  body: string;
}
interface Props {
  commentId: string;
  body: string;
  editComment?: (commentId: string, body: CommentData) => void;
  cleanErrors?: () => void;
}

export class EditComment extends Component<Props> {
  state: StateData = {
    open: false,
    body: "",
    errors: { error: "" },
  };

  static getDerivedStateFromProps(prevProps: any, prevState: StateData) {
    if (prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (!prevProps.UI.errors && !prevProps.UI.loading) {
      const prevStateData = {
        body: prevState.body,
        open: prevState.open,
        errors: prevState.errors,
      };
      prevState.body = "";
      prevState.open = false;
      prevState.errors.error = "";
      return prevStateData;
    }

    return null;
  }

  PostDetailsToState = (commentBody: string) => {
    this.setState({
      body: commentBody,
    });
  };
  handleOpen = () => {
    this.setState({
      open: true,
    });

    this.PostDetailsToState(this.props.body);
  };
  handleClose = () => {
    this.setState({
      open: false,
    });
    if (this.props.cleanErrors) this.props.cleanErrors();
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const reqData = {
      body: this.state.body,
    };
    if (this.props.editComment) {
      this.props.editComment(this.props.commentId, reqData);
    }
    if (this.state.body !== "") {
      this.handleClose();
    }
  };
  render() {
    const { errors } = this.state;
    return (
      <Fragment>
        <Tooltip title="Edit comment" placement="top">
          <IconButton
            onClick={this.handleOpen}
            style={{
              float: "right",
              width: 15,
              height: 15,
            }}
          >
            <EditIcon
              color="primary"
              fontSize="default"
              style={{ fontSize: 15 }}
            />
          </IconButton>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit comment</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="body"
                type="text"
                label="Body"
                multiline
                rows="3"
                error={errors && errors.error ? true : false}
                helperText={errors ? errors.error : ""}
                placeholder="Edit your comment."
                className="body"
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>

              <Button onClick={this.handleSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: mapStateToPropsData) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { editComment, cleanErrors })(
  EditComment
);
