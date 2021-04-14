import React, { Fragment } from "react";
import MyBtn from "../../util/MyBtn";
//MUI
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Close } from "@material-ui/icons";
//Redux
import { connect } from "react-redux";
import { createPost, cleanErrors } from "../../redux/actions/dataActions";
interface ErrorsData {
  body: string;
}
interface UIData {
  loading: boolean;
  errors: ErrorsData;
}
interface NewPostData {
  body: string;
}
interface Props {
  UI: UIData;
  createPost: (body: NewPostData) => void;
  cleanErrors: () => void;
}

interface StateData {
  open: boolean;
  body: string;
  errors: ErrorsData;
}
class CreatePost extends React.Component<Props> {
  state: StateData = {
    open: false,
    body: "",
    errors: { body: "" },
  };

  static getDerivedStateFromProps(prevProps: Props, prevState: StateData) {
    const prevStateData = {
      body: prevState.body,
      open: prevState.open,
      errors: prevState.errors,
    };
    if (prevProps.UI)
      if (prevProps.UI.errors) return { errors: prevProps.UI.errors };
    if (!prevProps.UI.errors && !prevProps.UI.loading) {
      prevState.body = "";
      prevState.open = false;
      prevState.errors.body = "";
      return prevStateData;
    }

    return null;
  }
  handleOpen = () => {
    this.setState({
      open: true,
    });
  };
  handleClose = () => {
    this.props.cleanErrors();
    this.setState({
      open: false,
      errors: {},
    });
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.createPost({ body: this.state.body });
    if (this.state.body.trim() !== "") this.handleClose();
    this.setState({
      body: "",
    });
  };
  render() {
    const { errors } = this.state;
    const {
      UI: { loading },
    } = this.props;
    return (
      <Fragment>
        <MyBtn tip="Create a post" onClick={this.handleOpen}>
          <AddIcon />
        </MyBtn>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <div style={{ position: "absolute", right: 5, top: 5 }}>
            <MyBtn
              tip="Close"
              onClick={this.handleClose}
              tipClassName="closeBtn"
            >
              <Close />
            </MyBtn>
          </div>
          <DialogTitle>Create a new Post</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Post"
                multiline
                rows="3"
                placeholder="Add post"
                error={errors.body ? true : false}
                helperText={errors.body}
                className="bodyPost"
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className="submitButton"
                disabled={loading}
                style={{
                  position: "relative",
                  marginTop: 10,
                }}
              >
                Submit
                {loading && (
                  <CircularProgress
                    style={{
                      position: "absolute",
                    }}
                    size={30}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: Props) => ({
  UI: state.UI,
});
export default connect(mapStateToProps, { createPost, cleanErrors })(
  CreatePost
);
