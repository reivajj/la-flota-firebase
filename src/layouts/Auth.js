import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

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
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default AuthLayout;
