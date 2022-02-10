import React from 'react';
import { Typography, Link } from '@mui/material';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {/* {'Copyright © '} */}
      <Link underline="hover" color="inherit" href="https://www.laflota.com.ar/" target="_blank">
        {`La Flota ♡ Distribución Digital ♫ 2016 - ${1900 + new Date().getYear()} ♫ Patagonia `}
      </Link>
    </Typography>
  );
}

export default Copyright;