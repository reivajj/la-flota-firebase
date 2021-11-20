import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme } from '@mui/material/styles';

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

const ProgressButton = ({ textButton, loading, buttonState, onClickHandler, noneIcon }) => {

  return (
    <div style={styles.root}>
      <div style={styles.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          sx={buttonState === "success" ? styles.buttonSuccess : buttonState === "error" ? styles.buttonError : { color: "primary" }}
          onClick={onClickHandler}
        >
          {buttonState === "none" ? noneIcon
            : buttonState === "success" ? <CheckIcon /> : <ErrorIcon />}

        </Fab>
        {loading && <CircularProgress size={68} sx={styles.fabProgress} />}

      </div>
      <div style={styles.wrapper}>
        <Button
          variant="contained"
          color="primary"
          sx={buttonState === "success" ? styles.buttonSuccess : buttonState === "error" ? styles.buttonError : { color: "primary" }}
          disabled={loading}
          onClick={onClickHandler}
        >
          {textButton}
        </Button>
        {loading && <CircularProgress size={24} sx={styles.buttonProgress} />}
      </div>
    </div>
  );
}

export default ProgressButton;