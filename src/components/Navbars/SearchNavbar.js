import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, IconButton, Box, Toolbar, Typography, InputBase } from '@mui/material';
import { Search as SearchIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { mainColor } from '../../variables/colors';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import useWindowDimensions from '../../customHooks/useWindowDimensions';

const SearchIconWrapper = styled('div')(({ theme }) => ({
  marginLeft: '-2em',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Search = styled('div')(({ theme, mainSearchColor }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(mainSearchColor ? mainSearchColor : theme.palette.common.white, mainSearchColor ? 0.85 : 0.15),
  '&:hover': {
    backgroundColor: alpha(mainSearchColor ? mainSearchColor : theme.palette.common.white, mainSearchColor ? 0.95 : 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
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
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },
}));

const SearchNavbar = (props) => {
  const { searchArrayProps, cleanSearchResults, appBarSx, appBarTitle, mainSearchColor, isOpen, handleCollapseTable } = props;
  const { width } = useWindowDimensions();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={appBarSx ? appBarSx : { borderRadius: '2em', backgroundColor: mainColor }}>
        <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>

          <IconButton key={'collapse' + isOpen} onClick={handleCollapseTable} >
            {isOpen
              ? <ExpandLess sx={{ color: "black" }} />
              : <ExpandMore sx={{ color: "black" }} />
            }
          </IconButton>

          {width > 1200 && <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, color: mainSearchColor ? mainSearchColor : 'white' }}
          >
            {appBarTitle ? appBarTitle : 'Buscador'}
          </Typography>}

          {searchArrayProps.map((searchProp, index) =>
            <Search key={'search' + index} mainSearchColor={mainSearchColor}>
              <StyledInputBase
                key={'input' + searchProp.name}
                onKeyPress={(event) => searchProp.handleEnterKeyPress(event, searchProp)}
                placeholder={searchProp.name}
                value={searchProp.value}
                onChange={(event) => { searchProp.setValue(event.target.value); }}
                inputProps={{ 'aria-label': searchProp.name }}
              />
              <IconButton key={'icon' + searchProp.name} onClick={() => searchProp.onSearchHandler(searchProp.value)} >{<SearchIcon key={'searchIcon' + index} sx={{ color: "white" }} />}</IconButton>
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={cleanSearchResults} >
            <SearchOffIcon sx={{ color: mainSearchColor ? mainSearchColor : 'white', fontSize: "1.7em" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchNavbar;