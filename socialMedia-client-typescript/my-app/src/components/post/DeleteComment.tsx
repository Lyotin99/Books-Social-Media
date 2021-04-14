import { Component, Fragment } from "react";
//MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
//Redux
import { connect } from "react-redux";
import { deleteComment } from "../../redux/actions/dataActions";

interface Props {
  deleteComment: (postId: string, commentId: string) => void;
  postId: string;
  commentId: string;
}

class DeleteComment extends Component<Props> {
  state = { open: false };
  handleOpen = () => {
    this.setState({
      open: true,
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  deleteComment = () => {
    this.props.deleteComment(this.props.postId, this.props.commentId);
    this.setState({ open: false });
  };
  render() {
    return (
      <Fragment>
        <Tooltip title="Delete comment" placement="top">
          <IconButton
            onClick={this.handleOpen}
            style={{
              float: "right",
              width: 15,
              height: 15,
            }}
          >
            <DeleteOutline
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
          <DialogTitle>
            Are you sure you want to delete the comment?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.deleteComment} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = () => ({});
export default connect(mapStateToProps, { deleteComment })(DeleteComment);
