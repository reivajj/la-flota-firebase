import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useDispatch, useSelector } from 'react-redux';
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import { container, grayColor } from "assets/jss/material-dashboard-react.js";
import useFirestoreQuery from '../../customHooks/useFirestoreQuery';
import { getDocIfLastUpdateFS } from '../../services/FirestoreServices';
import { userDataAddInfoStore } from '../../redux/actions/UserDataActions';

const NavbarMain = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector(store => store.userData);
  const stateUserSnap = useFirestoreQuery(getDocIfLastUpdateFS("users", userData?.id || 0, userData?.lastUpdateTS || 0));

  useEffect(() => {
    if (stateUserSnap.status === "loading") return "Loading...";
    if (stateUserSnap.status === "error") return `Error al cargar los ultimos Albums: ${stateUserSnap.error.message}`;
    if (stateUserSnap.status === "success" && stateUserSnap.data.length > 0) dispatch(userDataAddInfoStore(stateUserSnap.data[0]));
  }, [stateUserSnap])

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

export default NavbarMain;

NavbarMain.propTypes = {
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