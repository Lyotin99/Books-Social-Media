import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import EditDetails from "../post/EditDetails";
import MyBtn from "../../util/MyBtn";
import ProfileSkeleton from "../../util/PostSkeleton";
import "./profile.css";
//Mui
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import { KeyboardReturn } from "@material-ui/icons";
//Dayjs
import dayjs from "dayjs";
//Redux
import { connect } from "react-redux";
import { uploadImage, logoutUser } from "../../redux/actions/userActions";
//Interfaces
import { Posts } from "../post/postInterfaces";

interface Props {
  user: Posts;
  loading?: boolean;
  uploadImage: (formData: FormData) => void;
  logoutUser: () => void;
}
export class Profile extends React.Component<Props> {
  handleLogout = () => {
    this.props.logoutUser();
  };
  handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files ? event.target.files[0] : "";
    const formData = new FormData();
    if (image) formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  render() {
    const {
      user: {
        credentials: {
          bio,
          createdAt,
          favoriteBooks,
          imageUrl,
          favoriteQuote,
          location,
          username,
          website,
        },
        authenticated,
      },
      loading,
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className="paper">
          <div className="profile">
            <div className="profile-image">
              <img src={imageUrl} alt="profile" />
              <div id="editPictureButton">
                <input
                  type="file"
                  id="imageInput"
                  hidden
                  onChange={this.handleImageChange}
                />

                <MyBtn
                  tip="Edit profile picture"
                  onClick={this.handleEditPicture}
                  btnClassName="btn"
                >
                  <EditIcon color="primary" />
                </MyBtn>
              </div>
            </div>
            <br />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${username}`}
                color="primary"
                variant="h5"
              >
                {" "}
                {username}
              </MuiLink>
              <div className="userBio">
                {
                  <Typography variant="body2" style={{ fontSize: 20 }}>
                    {bio}
                  </Typography>
                }
              </div>
              <div className="location">
                {location && (
                  <Fragment>
                    <LocationOn
                      color="primary"
                      style={{
                        verticalAlign: "bottom",
                      }}
                    />
                    <span>{location}</span>
                  </Fragment>
                )}
              </div>
              <div className="website">
                {website && (
                  <Fragment>
                    <LinkIcon
                      color="primary"
                      style={{
                        verticalAlign: "bottom",
                      }}
                    />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {" "}
                      {website}
                    </a>
                    <br />
                  </Fragment>
                )}
              </div>
              <div className="favoriteBooks">
                Favorite Book/Books:{" "}
                {favoriteBooks && <span>{favoriteBooks}</span>}
              </div>
              <div className="favoriteQuote">
                Favorite Quote:{" "}
                {favoriteQuote && <cite>' {favoriteQuote} '</cite>}
              </div>
              <div className="user-joining-date">
                <CalendarToday
                  color="primary"
                  style={{
                    verticalAlign: "bottom",
                  }}
                />{" "}
                Joined{" "}
                {createdAt ? (
                  <span>
                    {dayjs(
                      createdAt._seconds
                        ? new Date(createdAt._seconds * 1000).toString()
                        : new Date().toString()
                    ).format("MMM YYYY")}
                  </span>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <Tooltip title="Logout" placement="top">
              <IconButton onClick={this.handleLogout}>
                <KeyboardReturn color="primary" />
              </IconButton>
            </Tooltip>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className="paper">
          <Typography variant="body2" align="center">
            <span className="no-profile">
              No profile found, please login again.
            </span>
          </Typography>
          <div className="btns">
            <div>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
                style={{
                  marginRight: 5,
                }}
              >
                Login
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </div>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}
const mapActionsToProps = {
  uploadImage,
  logoutUser,
};
const mapStateToProps = (state: Props) => ({
  user: state.user,
});
export default connect(mapStateToProps, mapActionsToProps)(Profile);
