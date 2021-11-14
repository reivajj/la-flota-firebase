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
  console.log(styles);
  return (
    <footer style={classes.footer}>
      <Grid container >
        <Grid item xs={4} sx={{ textAlign: "initial" }}>
          <List sx={classes.list}>
            <ListItem>
              <a href="#home">
                Home
              </a>
            </ListItem>
            <ListItem>
              <a href="#company">
                Company
              </a>
            </ListItem>
            <ListItem>
              <a href="#portfolio">
                Portfolio
              </a>
            </ListItem>
            <ListItem>
              <a href="#blog">
                Blog
              </a>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={8} sx={classes.gridLaFlotaDer}>
          <p >
            <span>
              &copy; {1900 + new Date().getYear()}{" "}
              <a
                href="https://www.creative-tim.com?ref=mdr-footer"
                target="_blank"
                style={classes.a}
              >
                La Flota
              </a>
            </span>
          </p>
        </Grid>
      </Grid>
    </footer>
  );
}
