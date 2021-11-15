import React, { useState } from "react";
import classNames from "classnames";
import { useNavigate } from 'react-router-dom';
import * as actions from 'redux/actions/AuthActions.js';
import { useDispatch } from "react-redux";
import makeStyles from '@mui/styles/makeStyles';
import { MenuItem, MenuList, Paper, ClickAwayListener, Divider, Menu } from "@mui/material";
import { Person, Notifications, Dashboard, Search } from "@mui/icons-material";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { createTheme } from '@mui/material/styles';

const useStyles = makeStyles(styles);

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

  const [openNotification, setOpenNotification] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(false);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  const handleClickOnDashboard = () => {
    navigate("dashboard");
  }

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(false);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleSignOut = async () => {
    let [errorSignOut] = await to(dispatch(actions.signOutFromFirebase()));
    if (errorSignOut) console.log("Error al realizar signOut: ", errorSignOut);

    setOpenProfile(false);
    navigate("/login");
  };

  const handleCloseProfileMenu = () => {
    setOpenProfile(false);
  }

  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>
      <Button
        aria-label="Dashboard"
        sx={styles.buttonLink}
      >
        <Dashboard className={classes.icons} onClick={handleClickOnDashboard} />
      </Button>
      <div className={classes.manager}>
        <Button
          onClick={handleClickNotification}
          sx={styles.buttonLink}
        >
          <Notifications className={classes.icons} />
          <span className={classes.notifications}>5</span>
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={openNotification}
          open={openNotification}
          onClose={handleCloseNotification}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          <MenuList role="menu">
            <MenuItem
              onClick={handleCloseNotification}
              className={classes.dropdownItem}
            >
              Mike John responded to your email
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotification}
              className={classes.dropdownItem}
            >
              You have 5 new tasks
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotification}
              className={classes.dropdownItem}
            >
              You{"'"}re now friend with Andrew
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotification}
              className={classes.dropdownItem}
            >
              Another Notification
            </MenuItem>
            <MenuItem
              onClick={handleCloseNotification}
              className={classes.dropdownItem}
            >
              Another One
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      <div className={classes.manager}>
        <Button
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
        >
          <Person className={classes.icons} />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={openProfile}
          open={openProfile}
          onClose={handleCloseProfileMenu}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}>
          <MenuList role="menu">
            <MenuItem
              onClick={handleCloseProfileMenu}
              className={classes.dropdownItem}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleCloseProfileMenu}
              className={classes.dropdownItem}
            >
              Settings
            </MenuItem>
            <Divider light />
            <MenuItem
              onClick={handleSignOut}
              className={classes.dropdownItem}
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
