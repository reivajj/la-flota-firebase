import React from "react";
import { styled, alpha } from '@mui/material/styles';
import { AppBar, IconButton, Divider, Box, Toolbar, Typography, InputBase, Grid, Tooltip, MenuItem, Select } from '@mui/material';
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

const AccountingBar = (props) => {
  const { searchArrayProps, groupByProps, cleanSearchResults, appBarSx, appBarTitle, mainSearchColor, isOpen, handleCollapseTable } = props;
  const { width } = useWindowDimensions();
  const smallWindow = width < 1400;
  const caller = "accounting";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={appBarSx ? appBarSx : { borderRadius: '2em', backgroundColor: mainColor }}>
        <Toolbar style={{ paddingLeft: "0px", paddingRight: "0px" }}>

          <IconButton key={'collapse' + isOpen} onClick={handleCollapseTable} >
            {isOpen
              ? <ExpandLess sx={{ color: "black" }} />
              : <ExpandMore sx={{ color: "black" }} />
            }
          </IconButton>

          {!smallWindow && <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, width: "100px", color: mainSearchColor ? mainSearchColor : 'white' }}
          >
            {appBarTitle}
          </Typography>}

          {groupByProps.values.length > 0 &&
            <Tooltip key={'tooltip groupBy'} placement='top' title={"Puedes agrupar los resultados según las siguientes opciones"}>
              <Search key={'search groupBy'} mainSearchColor={mainSearchColor}>
                <Select
                  key={'input groupBy'}
                  value={groupByProps.value.name}
                  onChange={event => groupByProps.handleChangeGroupBy(event.target.value)}
                  input={<StyledInputBase />}
                >
                  {groupByProps.values.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Search>
            </Tooltip>}

          <Divider sx={{ borderWidth: "2px" }} variant="middle" orientation="vertical" flexItem />

          {searchArrayProps.map((searchProp, index) =>
            <Tooltip key={'tooltip' + index} title={searchProp.name}>
              <Search key={'search' + index} mainSearchColor={mainSearchColor} style={{ width: smallWindow ? "25%" : "auto" }}>
                <Grid container sx={{ height: "40px" }}>
                  <Grid item xs={9} sx={{ height: "inherit" }}>
                    <StyledInputBase
                      key={'input' + searchProp.name}
                      onKeyPress={(event) => searchProp.handleEnterKeyPress(event, searchProp, caller)}
                      placeholder={searchProp.name}
                      value={searchProp.value}
                      onChange={(event) => { searchProp.setValue(event.target.value); }}
                      inputProps={{ 'aria-label': searchProp.name }}
                    />
                  </Grid>
                  <Grid item xs={3} sx={{ height: "inherit" }}>
                    <IconButton key={'icon' + searchProp.name} sx={{ padding: 0, marginTop: "10px" }} onClick={() => searchProp.onSearchHandler(searchProp.value, caller)} >
                      {<SearchIcon key={'searchIcon' + index} sx={{ color: "white" }} />}
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
    </Box>
  );
}

export default AccountingBar;

// const dividerStyle = { height: "90%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };