import { Fragment } from "react";
import { Link } from "react-router-dom";
//MUI
import MuiLink from "@material-ui/core/Link";
import { Paper, Typography } from "@material-ui/core";
import { LocationOn, CalendarToday } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
//Dayjs
import dayjs from "dayjs";
//Interfaces
import { Credentials } from "../post/postInterfaces";

interface Props {
  profile: Credentials;
}

function StaticProfile(props: Props) {
  const {
    profile: {
      username,
      createdAt,
      imageUrl,
      bio,
      website,
      location,
      favoriteBooks,
      favoriteQuote,
    },
  } = props;

  return (
    <Paper className="paper">
      <div className="profile">
        <div className="profile-image">
          <img src={imageUrl} alt="profile" />
        </div>
        <br />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/users/${username} `}
            color="primary"
            variant="h5"
          >
            {username}
          </MuiLink>
          <div className="userBio">
            {bio && (
              <Typography variant="body2" style={{ fontSize: 20 }}>
                {bio}
              </Typography>
            )}
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
            Favorite Book/Books: {favoriteBooks && <span>{favoriteBooks}</span>}
          </div>
          <div className="favoriteQuote">
            Favorite Quote: {favoriteQuote && <cite>' {favoriteQuote} '</cite>}
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
      </div>
    </Paper>
  );
}
export default StaticProfile;
