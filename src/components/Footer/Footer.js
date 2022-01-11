/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";
import { Grid } from '@mui/material';

export default function Footer(props) {
  const classes = styles;
  return (
    <footer style={classes.footer}>
      <Grid container >
        <Grid item xs={4} sx={{ textAlign: "initial" }}>
          <List sx={classes.list}>
            <ListItem>
              <a href="dashboard">
                Home
              </a>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={8} sx={classes.gridLaFlotaDer}>
          <p >
            <span>
              <a
                href="https://laflota.com.ar"
                target="_blank"
                style={classes.a}
              >
                {`La Flota | Distribución Digital | 2016 - ${1900 + new Date().getYear()}`}
              </a>
            </span>
          </p>
        </Grid>
      </Grid>
    </footer>
  );
}
