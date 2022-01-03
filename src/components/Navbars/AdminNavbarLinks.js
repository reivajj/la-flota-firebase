import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as actions from 'redux/actions/AuthActions.js';
import { useDispatch } from "react-redux";
import makeStyles from '@mui/styles/makeStyles';
import { MenuItem, MenuList, Divider, Menu, Badge } from "@mui/material";
import { Person, Notifications, Dashboard, Search } from "@mui/icons-material";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { createTheme } from '@mui/material/styles';

import { primaryColor, whiteColor, primaryBoxShadow, defaultFont, grayColor } from "assets/jss/material-dashboard-react.js";


const useStyles = makeStyles(styles);
const theme = createTheme();

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const AdminNavbarLinks = () => {
  const classes = useStyles();
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const openNotifications = Boolean(anchorElNotifications)

  const handleClickNotification = (event) => {
    setAnchorElNotifications(event.currentTarget);
  }
  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const openProfile = Boolean(anchorElProfile);

  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  const handleGoToProfilePage = () => {
    setAnchorElProfile(null);
    navigate("user")
  };

  const handleClickOnDashboard = () => {
    navigate("dashboard");
  }

  const handleSignOut = async () => {
    let [errorSignOut] = await to(dispatch(actions.signOutFromFirebase()));
    if (errorSignOut) console.log("Error al realizar signOut: ", errorSignOut);

    setAnchorElProfile(null);
    navigate("/login");
  };

  return (
    <div>
      <div style={searchWrapperStyle}>
      </div>
      <Button
        aria-label="Dashboard"
        sx={buttonLinkStyle}
      >
        <Dashboard className={classes.icons} onClick={handleClickOnDashboard} />
      </Button>
      <div style={managerStyle}>
        <Button
          onClick={handleClickNotification}
          sx={buttonLinkStyle}
        >
          <Badge badgeContent={4} color="error">
            <Notifications className={classes.icons} />
          </Badge>
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorElNotifications}
          open={openNotifications}
          onClose={handleCloseNotifications}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          <MenuList role="menu">
            <MenuItem
              onClick={handleCloseNotifications}
              sx={dropdownItemStyle}
            >
              Mike John responded to your email
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotifications}
              sx={dropdownItemStyle}
            >
              You have 5 new tasks
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotifications}
              sx={dropdownItemStyle}
            >
              You{"'"}re now friend with Andrew
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotifications}
              sx={dropdownItemStyle}
            >
              Another Notification
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotifications}
              sx={dropdownItemStyle}
            >
              Another One
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      <div style={managerStyle}>
        <Button
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
        >
          <Person className={classes.icons} />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorElProfile}
          open={openProfile}
          onClose={handleCloseProfileMenu}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}>
          <MenuList role="menu">
            <MenuItem
              onClick={handleGoToProfilePage}
              sx={dropdownItemStyle}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleCloseProfileMenu}
              sx={dropdownItemStyle}
            >
              Settings
            </MenuItem>
            <Divider light />
            <MenuItem
              onClick={handleSignOut}
              sx={dropdownItemStyle}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div >
  );
}

export default AdminNavbarLinks;

const buttonLinkStyle = {
  [theme.breakpoints.down("md")]: {
    display: "flex",
    marginLeft: "30px",
    width: "auto"
  }
}
const dropdownItemStyle = {
  ...defaultFont,
  fontSize: "13px",
  padding: "10px 20px",
  margin: "0 5px",
  borderRadius: "2px",
  WebkitTransition: "all 150ms linear",
  MozTransition: "all 150ms linear",
  OTransition: "all 150ms linear",
  MsTransition: "all 150ms linear",
  transition: "all 150ms linear",
  display: "block",
  clear: "both",
  fontWeight: "400",
  lineHeight: "1.42857143",
  color: grayColor[8],
  whiteSpace: "nowrap",
  height: "unset",
  minHeight: "unset",
  "&:hover": {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...primaryBoxShadow
  }
}

const searchWrapperStyle = {
  [theme.breakpoints.down("sm")]: {
    width: "-webkit-fill-available",
    margin: "10px 15px 0"
  },
  display: "inline-block"
}

const managerStyle = {
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  },
  display: "inline-block"
}