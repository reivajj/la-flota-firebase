import React, { useState, createRef, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
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

import bgImage from "assets/img/sidebarLF.jpg";
import logo from "assets/img/only_circle_laflota_blue.png";
// import logo from "assets/img/login-avatar1.jpg";

import Notifications from "views/Notifications/Notifications";
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

const AdminLayout = ({ ...rest }) => {

  const location = useLocation();
  const auth = useSelector(store => store.auth);
  const user = useSelector(store => store.userData);

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

  // let dateMinusMinute = new Date(user.lastTimeSignedIn - 60000);

  // PROTECTED ROUTES NOT REGISTERED
  // para finalizar sesiones.
  if (!auth || !auth.user || !auth.user.id) return <Navigate to="/login" state={{ from: location }} />;
  // if (user.lastTimeSignedIn < 1657888172755 || !auth || !auth.user || !auth.user.id) return <Navigate to="/login" state={{ from: location }} />;

  return (
    <div style={mainStyle}>

      <Sidebar
        routes={routes}
        logoText={"La Flota"}
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