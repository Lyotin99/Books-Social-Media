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
import { deleteReply } from "../../redux/actions/dataActions";

interface Props {
  replyId: string;
  commentId: string;
  deleteReply?: (commentId: string, replyId: string) => void;
}
export class DeleteReply extends Component<Props> {
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
    if (this.props.deleteReply)
      this.props.deleteReply(this.props.commentId, this.props.replyId);
    this.setState({ open: false });
  };
  render() {
    return (
      <Fragment>
        <Tooltip title="Delete reply" placement="top">
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
          <DialogTitle>Are you sure you want to delete the reply?</DialogTitle>
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
export default connect(mapStateToProps, { deleteReply })(DeleteReply);
