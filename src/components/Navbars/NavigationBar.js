import * as React from 'react';
import { AppBar, IconButton, Box, Toolbar, Typography } from '@mui/material';
import { mainColor } from '../../variables/colors';
import { NavigateBefore, NavigateNext } from '@mui/icons-material/';

const NavigationBar = ({ title, handleClickBefore, handleClickAfter }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ borderRadius: '2em', backgroundColor: mainColor }}>
        <Toolbar>
          <IconButton onClick={handleClickBefore} >{<NavigateBefore sx={{ color: 'white', fontSize: "1.7em" }} />}</IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ marginLeft: '10%' }}>
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClickAfter} >{<NavigateNext sx={{ color: 'white', fontSize: "1.7em" }} />}</IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;