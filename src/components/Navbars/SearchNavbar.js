import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, IconButton, Box, Toolbar, Typography, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { mainColor } from '../../variables/colors';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import useWindowDimensions from '../../customHooks/useWindowDimensions';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  marginLeft: '-2em',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  const { searchArrayProps, cleanSearchResults } = props;
  const { width } = useWindowDimensions();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ borderRadius: '2em', backgroundColor: mainColor }}>
        <Toolbar>

          {width > 1200 && <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Buscador
          </Typography>}

          {searchArrayProps.map(searchProp =>
            <Search>
              <StyledInputBase
                placeholder={searchProp.name}
                value={searchProp.value}
                onChange={(event) => { searchProp.setValue(event.target.value); }}
                inputProps={{ 'aria-label': 'search-email' }}
              />
              <IconButton onClick={() => searchProp.onSearchHandler(searchProp.value)} >{<SearchIcon sx={{ color: "white" }} />}</IconButton>
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={cleanSearchResults} >{<SearchOffIcon sx={{ color: 'white', fontSize: "1.7em" }} />}</IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchNavbar;