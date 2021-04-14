import React, { Component, Fragment } from "react";
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
import { editPost, cleanErrors } from "../../redux/actions/dataActions";
//Interfaces
import { UIData, PostDialogErrorData } from "./postInterfaces";
interface ErrorsData {
  errors: { error: string };
  loading: boolean;
}

interface MapStateToPropsData {
  UI: ErrorsData;
}
interface Props {
  postId: string;
  body: string;
  UI?: UIData;
  editPost?: (postId: string, body: string) => void;
  cleanErrors?: () => void;
}
interface StateData {
  open: boolean;
  body: string;
  errors: PostDialogErrorData;
}
export class EditPost extends Component<Props> {
  state: StateData = {
    open: false,
    body: "",
    errors: {},
  };

  static getDerivedStateFromProps(prevProps: Props, prevState: StateData) {
    if (prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (prevProps.UI && !prevProps.UI.errors && !prevProps.UI.loading) {
      const prevStateData = {
        open: false,
        body: prevState.body,
        errors: prevState.errors,
      };
      prevStateData.body = "";
      prevStateData.errors.error = "";

      return prevState;
    }

    return null;
  }

  PostDetailsToState = (PostBody: string) => {
    this.setState({
      body: PostBody,
    });
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
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
      errors: {},
    });
    if (this.props.cleanErrors) this.props.cleanErrors();
  };

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.preventDefault();
    if (this.props.editPost) {
      this.props.editPost(this.props.postId, this.state.body);
    }
    if (this.state.body.trim() !== "") {
      this.handleClose();
    }
  };
  render() {
    const { errors } = this.state;

    return (
      <Fragment>
        <Tooltip title="Edit post" placement="top">
          <IconButton
            onClick={this.handleOpen}
            className="button"
            style={{
              float: "right",
            }}
          >
            <EditIcon color="primary" fontSize="small" />
          </IconButton>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit post</DialogTitle>
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
                placeholder="Edit your post."
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

const mapStateToProps = (state: MapStateToPropsData) => ({
  UI: state.UI,
});
export default connect(mapStateToProps, { editPost, cleanErrors })(EditPost);
