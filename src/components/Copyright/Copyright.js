import React from 'react';
import { Typography, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link underline="hover" color="inherit" href="https://www.laflota.com.ar/">
        La Flota
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;