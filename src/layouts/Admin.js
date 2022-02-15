import React, { useState, createRef } from "react";
import { Outlet } from "react-router-dom";
// creates a beautiful scrollbar
// import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/only_circle_laflota_blue.png";
// import logo from "assets/img/login-avatar1.jpg";

import Notifications from "views/Notifications/Notifications";

const useStyles = makeStyles(styles);

const AdminLayout = ({ ...rest }) => {
  // styles
  const { children } = { ...rest };
  const classes = useStyles();
  const mainPanel = createRef();
  // states and functions
  const image = bgImage;
  // El color del boton en el menu lateral, una vez que lo presionamos
  const color = "blue";
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div style={mainStyle}>

      <Sidebar
        routes={routes}
        logoText={"La Flota"}
        // logoText={"La Flota ♫ Distribución Digital"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        <Outlet />

        <div className={classes.content}>
          <div className={classes.container}>
            {children}
          </div>
        </div>

        <Notifications />
        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;

const mainStyle = {
  paddingLeft: "15px",
  paddingRight: "15px",
}