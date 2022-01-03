import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';
import { createTheme } from '@mui/material/styles';

const ProgressButton = ({ textButton, loading, buttonState, onClickHandler, noneIcon, color }) => {
  return (
    <div style={styles.root}>
      <div style={styles.wrapper}>
        <Fab
          aria-label="save"
          color={color}
          sx={buttonState === "success" ? styles.buttonSuccess : buttonState === "error" ? styles.buttonError : styles.buttonNone}
          onClick={onClickHandler}
        >
          {buttonState === "none" ? noneIcon
            : buttonState === "success" ? <CheckIcon sx={{color: "rgba(255,255,255, 1)"}}/> : <ReplayIcon sx={{ color: "rgba(255,255,255, 1)" }} />}

        </Fab>
        {loading && <CircularProgress size={68} sx={styles.fabProgress} />}

      </div>
      <div style={styles.wrapper}>
        <Button
          variant="contained"
          color={color}
          sx={buttonState === "success" ? styles.buttonSuccess : buttonState === "error" ? styles.buttonError : styles.buttonNone}
          disabled={loading}
          onClick={onClickHandler}
        >
          {textButton}
        </Button>
      </div>
    </div>
  );
}

export default ProgressButton;

const theme = createTheme();

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
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
  buttonError: {
    backgroundColor: red[800],
    '&:hover': {
      backgroundColor: red[900],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    // top: '50%',
    // left: '50%',
    // marginTop: -12,
    // marginLeft: -12,
  },
};