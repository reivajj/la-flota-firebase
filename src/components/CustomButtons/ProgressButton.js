import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import { Button, Fab, Grid } from '@mui/material';
import { Check, Replay, Delete } from '@mui/icons-material/';
import { createTheme } from '@mui/material/styles';
import { Tooltip } from '../../../node_modules/@mui/material/index';

const getStyleFromStateButton = (buttonState, noFab) => {
  if (buttonState === "success") return styles.buttonSuccess;
  if (buttonState === "error" && !noFab) return styles.buttonErrorFab;
  if (buttonState === "delete") return styles.buttonDelete;
  if (buttonState === "error" && noFab) return styles.buttonErrorNoFab
  return styles.buttonNone;
}

const ProgressButton = ({ textButton, loading, disabled, buttonState, onClickHandler, successIcon, noneIcon, color, noFab,
  buttonFullWidth, buttonSx, buttonProgressSx, tooltipText }) => {

  const getEndButtonIcon = () => {
    if (buttonState === "delete" && noFab) return <Delete />;
    if (buttonState === "error" && noFab) return <Replay />;
    return "";
  }

  const endButtonIcon = getEndButtonIcon();

  return (
    <Grid container sx={styles.root}>
      {!noFab &&
        <Grid item sx={styles.wrapper}>
          <Fab
            aria-label="save"
            color={color}
            sx={getStyleFromStateButton(buttonState, noFab)}
            onClick={onClickHandler}
          >
            {(buttonState === "none" || buttonState === "delete") ? noneIcon
              : buttonState === "success"
                ? successIcon ? successIcon : <Check sx={{ color: "rgba(255,255,255, 1)" }} />
                : <Replay sx={{ color: "rgba(255,255,255, 1)" }} />}

          </Fab>
          {loading && <CircularProgress size={68} sx={styles.fabProgress} />}

        </Grid>}
      <Grid item sx={noFab ? styles.wrapperNoFab : styles.wrapperFab}>
        <Tooltip title={tooltipText ? tooltipText : ""}>
          <Button
            variant="contained"
            fullWidth={buttonFullWidth}
            color={color}
            sx={buttonSx ? buttonSx : getStyleFromStateButton(buttonState, noFab)}
            disabled={loading || disabled}
            onClick={onClickHandler}
            endIcon={endButtonIcon}
          >
            {textButton}
          </Button>
        </Tooltip>
        {noFab && loading && <CircularProgress size={30} sx={buttonProgressSx || styles.buttonProgress} />}
      </Grid>
    </Grid>
  );
}

export default ProgressButton;

const theme = createTheme();

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperNoFab: {
    width: "inherit",
    position: "relative",
    justifyContent: "center"
  },
  wrapperFab: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonNone: {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  buttonErrorFab: {
    backgroundColor: red[800],
    '&:hover': {
      backgroundColor: red[900],
    },
  },
  buttonErrorNoFab: {
    backgroundColor: red[800],
    '&:hover': {
      backgroundColor: red[900],
    },
    width: "inherit"
  },
  buttonDelete: {
    backgroundColor: "#c50e29",
    '&:hover': {
      backgroundColor: "#c50e29",
    },
    color: "white",
    width: "inherit"
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    marginTop: '-6px',
    marginLeft: '-62px',
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    marginTop: '3px',
    marginLeft: '-7.5em',
    zIndex: 1,
  },
};