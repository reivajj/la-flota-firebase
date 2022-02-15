import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";

import {
  container,
  // defaultFont,
  grayColor
} from "assets/jss/material-dashboard-react.js";

export default function Header(props) {

  return (
    <AppBar sx={appBarStyle}>
      <Toolbar sx={containerStyle}>
        <div style={flexStyle}>
          {/* Aca podemos poner un BIENVENIDOS o algo asi... */}
        </div>
        {<AdminNavbarLinks />}
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
// const titleStyle = {
//   ...defaultFont,
//   letterSpacing: "unset",
//   lineHeight: "30px",
//   fontSize: "18px",
//   borderRadius: "3px",
//   textTransform: "none",
//   color: "inherit",
//   margin: "0",
// }
