import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, IconButton, Box, Toolbar, Typography, Grid, InputBase, Tooltip } from '@mui/material';
import { Search as SearchIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { mainColor } from '../../variables/colors';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import useWindowDimensions from '../../customHooks/useWindowDimensions';

const Search = styled('div')(({ theme, mainSearchColor }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(mainSearchColor ? mainSearchColor : theme.palette.common.white, mainSearchColor ? 0.85 : 0.15),
  '&:hover': {
    backgroundColor: alpha(mainSearchColor ? mainSearchColor : theme.palette.common.white, mainSearchColor ? 0.95 : 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const SearchNavbar = (props) => {
  const { searchArrayProps, cleanSearchResults, appBarSx, appBarTitle, mainSearchColor, isOpen, handleCollapseTable } = props;
  const { width } = useWindowDimensions();
  const collapsable = handleCollapseTable !== undefined;
  const smallWindow = width < 1200;
  const caller = "royalties";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={appBarSx ? appBarSx : { borderRadius: '2em', backgroundColor: mainColor }}>
        <Toolbar style={{ paddingLeft: collapsable ? 0 : "16px", paddingRight: collapsable ? 0 : "16px" }}>

          {collapsable && <IconButton key={'collapse' + isOpen} onClick={handleCollapseTable} >
            {isOpen
              ? <ExpandLess sx={{ color: "black" }} />
              : <ExpandMore sx={{ color: "black" }} />
            }
          </IconButton>}

          {!smallWindow && <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, width: "100px", color: mainSearchColor ? mainSearchColor : 'white' }}
          >
            {appBarTitle ? appBarTitle : 'Buscador'}
          </Typography>}

          {searchArrayProps.map((searchProp, index) =>
            <Tooltip key={'tooltip' + index} title={searchProp.name}>
              <Search key={'search' + index} mainSearchColor={mainSearchColor} style={{ width: smallWindow ? "20%" : "auto" }}>
                <Grid container sx={{ height: "40px" }}>

                  <Grid item xs={9} sx={{ height: "inherit" }}>
                    <StyledInputBase
                      key={'input' + searchProp.name}
                      onKeyPress={(event) => searchProp.handleEnterKeyPress(event, searchProp, caller)}
                      placeholder={smallWindow ? searchProp.shortName : searchProp.name}
                      value={searchProp.value}
                      onChange={(event) => { searchProp.setValue(event.target.value); }}
                      inputProps={{ 'aria-label': searchProp.name }}
                    />
                  </Grid>
                  <Grid item xs={3} sx={{ height: "inherit" }}>
                    <IconButton key={'icon' + searchProp.name} sx={{ padding: 0, marginTop: "10px" }} onClick={() => searchProp.onSearchHandler(searchProp.value, caller)} >
                      <SearchIcon key={'searchIcon' + index} sx={{ color: "white" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Search>
            </Tooltip>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => cleanSearchResults(caller)} >
            <SearchOffIcon sx={{ color: mainSearchColor ? mainSearchColor : 'white', fontSize: "1.7em", marginTop: "10px" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box >
  );
}

export default SearchNavbar;