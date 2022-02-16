/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";
import { Grid } from '@mui/material';
import GoogleColorIcon from '../../views/Icons/GoogleColorIcon';
import { IconButton } from '@mui/material';
import { Facebook, Google, Instagram, Twitter } from '@mui/icons-material';

export default function Footer(props) {
  const classes = styles;
  return (
    <footer style={classes.footer}>
      <Grid container >
        <Grid item xs={4} sx={{ textAlign: "initial" }}>
          <List sx={classes.list}>
            <ListItem>
              <IconButton href="https://goo.gl/maps/SXDovofbcrCFBsxE9" target="_blank">
                <Google />
              </IconButton>
              <IconButton href="https://www.facebook.com/laflota.distribuciondigital" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton href="https://twitter.com/LaflotaD" target="_blank">
                <Twitter />
              </IconButton>
              <IconButton href="https://www.instagram.com/laflota.distribuciondigital/" target="_blank">
                <Instagram />
              </IconButton>
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
                {`La Flota ♡ Distribución Digital ♫ 2016 ✧ ${1900 + new Date().getYear()} ♫ Patagonia `}
              </a>
            </span>
          </p>
        </Grid>
      </Grid>
    </footer>
  );
}
