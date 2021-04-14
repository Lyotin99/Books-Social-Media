import React, { Fragment } from "react";
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
import { editUserDetails } from "../../redux/actions/userActions";
//Interfaces
import { Credentials, UserDetails } from "./postInterfaces";

interface Props {
  credentials: Credentials;
  editUserDetails: (userDetails: UserDetails) => void;
}
interface UserCredentials {
  user: { credentials: Credentials };
}

interface IsOpen {
  open: boolean;
}
export class EditDetails extends React.Component<Props> {
  state: UserDetails & IsOpen = {
    bio: "",
    website: "",
    location: "",
    favoriteQuote: "",
    favoriteBooks: "",
    open: false,
  };
  mapUserDetailsToState = (credentials: UserDetails) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
      favoriteBooks: credentials.favoriteBooks ? credentials.favoriteBooks : "",
      favoriteQuote: credentials.favoriteQuote ? credentials.favoriteQuote : "",
    });
  };
  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
      favoriteBooks: this.state.favoriteBooks,
      favoriteQuote: this.state.favoriteQuote,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
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
    this.mapUserDetailsToState(this.props.credentials);
  };
  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }

  render() {
    return (
      <Fragment>
        <Tooltip title="Edit details" placement="top">
          <IconButton
            onClick={this.handleOpen}
            className="button"
            style={{
              float: "right",
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className="bio"
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your personal/professional website"
                className="website"
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Where do you live?"
                className="location"
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="favoriteBooks"
                type="text"
                label="Favorite Books"
                placeholder="What is/are your favorite book/s"
                className="favoriteBooks"
                value={this.state.favoriteBooks}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="favoriteQuote"
                type="text"
                label="Favorite Quote"
                placeholder="What is your favorite quote?"
                className="favoriteQuote"
                value={this.state.favoriteQuote}
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

const mapStateToProps = (state: UserCredentials) => ({
  credentials: state.user.credentials,
});
export default connect(mapStateToProps, { editUserDetails })(EditDetails);
