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
      <AppBar className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <Button color="transparent" href="#" className={classes.title}>
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
