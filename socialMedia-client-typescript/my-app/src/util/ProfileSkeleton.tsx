import React from "react";
import noImg from "../photos/no-img.png";
//Mui
import Paper from "@material-ui/core/Paper";
//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

interface Props {}
const ProfileSkeleton = (props: Props) => {
  return (
    <Paper>
      <div className="profile">
        <div className="image-wrapper" style={{ display: "flex" }}>
          <img
            src={noImg}
            alt="profile"
            className="profile-image"
            style={{ borderRadius: "50%" }}
          />
        </div>
        <hr style={{ width: "90%" }} />
        <div className="profile-details">
          <div className="username"></div>
          <hr />
          <div className="fullLine"></div>
          <div className="fullLine"></div>
          <hr />
          <div style={{ textAlign: "left" }}>
            <LocationOn color="primary" />
            <span>Location</span>
          </div>
          <hr />
          <div style={{ textAlign: "left" }}>
            <LinkIcon color="primary" />
            https://Your website.com
          </div>
          <hr />
          <div className="fullLine"></div>
          <div className="fullLine"></div>
          <CalendarToday color="primary" />
        </div>
      </div>
    </Paper>
  );
};
export default ProfileSkeleton;
