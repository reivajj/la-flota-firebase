import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Outlet } from "react-router-dom";

const useStyles = makeStyles(({
  root: {
    height: "100%",
  },
  container:{
    height: "100%",
  }
}));

const AuthLayout = props => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        {children}
      </main>
      <Outlet />
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default AuthLayout;
