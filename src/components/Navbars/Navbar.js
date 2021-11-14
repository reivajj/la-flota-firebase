import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
// @mui/icons-material
import Menu from "@mui/icons-material/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import { useLocation } from "react-router-dom";

import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles(styles);
export default function Header(props) {
  const classes = useStyles();
  const url = useLocation();

  const makeBrand = () => {
    var name;
    props.routes.map(prop => {
      if (url.pathname === prop.layout + prop.path) {
        name = prop.name;
      }
      return null;
    });
    return name;
  }
  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });

  return (
    <AppBar sx={appBarStyle}>
      <Toolbar sx={containerStyle}>
        <div style={flexStyle}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" sx={titleStyle}>
            {makeBrand()}
          </Button>
        </div>
        <Hidden mdDown implementation="css">
          {<AdminNavbarLinks />}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
            size="large">
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object)
};

const appBarStyle = {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: "0",
  marginBottom: "0",
  position: "relative",
  width: "100%",
  paddingTop: "0px",
  // zIndex: "1029",
  color: grayColor[7],
  border: "0",
  borderRadius: "3px",
  padding: "10px 0",
  transition: "all 150ms ease 0s",
  minHeight: "50px",
  display: "block"
}

const containerStyle = {
  ...container,
  minHeight: "50px"
}
const flexStyle = {
  flex: 1
}
const titleStyle = {
  ...defaultFont,
  letterSpacing: "unset",
  lineHeight: "30px",
  fontSize: "18px",
  borderRadius: "3px",
  textTransform: "none",
  color: "inherit",
  margin: "0",
  "&:hover,&:focus": {
    background: "transparent"
  }
}

const appResponsiveStyle = {
  top: "8px"
}

const primaryStyle = {
  backgroundColor: primaryColor[0],
  color: whiteColor,
  ...defaultBoxShadow
}

const infoStyle = {
  backgroundColor: infoColor[0],
  color: whiteColor,
  ...defaultBoxShadow
}

const successStyle = {
  backgroundColor: successColor[0],
  color: whiteColor,
  ...defaultBoxShadow
}

const warningStyle = {
  backgroundColor: warningColor[0],
  color: whiteColor,
  ...defaultBoxShadow
}
const dangerStyle = {
  backgroundColor: dangerColor[0],
  color: whiteColor,
  ...defaultBoxShadow
}