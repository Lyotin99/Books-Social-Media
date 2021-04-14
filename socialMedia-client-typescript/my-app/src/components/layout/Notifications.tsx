import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//Dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//Mui
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

interface DateObj {
  _seconds: number;
  _nanoseconds: number;
}

interface NotificationsData {
  recipient: string;
  sender: string;
  createdAt: DateObj;
  postId: string;
  type: string;
  read: boolean;
  notificationId: string;
}
interface Props {
  markNotificationsRead: (notificationIds: string[]) => void;
  notifications: NotificationsData[];
}

interface StateToPropsData {
  user: { notifications: NotificationsData[] };
}
class Notifications extends Component<Props> {
  state = {
    anchorEl: null,
  };
  handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({
      anchorEl: event.target,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    dayjs.extend(relativeTime);
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;
    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else notificationsIcon = <NotificationsIcon />;
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const verb = not.type === "like" ? "liked" : "commented on";
          const time = dayjs(new Date(not.createdAt._seconds * 1000)).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
          return (
            <MenuItem key={not.createdAt._seconds} onClick={this.handleClose}>
              <Link
                to={`/users/${not.recipient}/post/${not.postId}`}
                onClick={() => {
                  window.location.pathname = `/post/${not.postId}`;
                }}
              >
                {icon}
              </Link>
              <Typography
                component={Link}
                color="inherit"
                variant="body1"
                to={`/users/${not.recipient}/post/${not.postId}`}
                onClick={() => {
                  window.location.pathname = `/post/${not.postId}`;
                }}
              >
                {`${not.sender} ${verb} your post ${time}`}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );

    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          style={{ marginTop: 40 }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}
const mapStateToProps = (state: StateToPropsData) => ({
  notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
