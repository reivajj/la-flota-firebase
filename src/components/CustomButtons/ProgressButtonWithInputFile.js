import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme } from '@mui/material/styles';

import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ProgressButtonWithInputFile = ({ textButton, loading, buttonState, onClickHandler, progress, fileType, helperText }) => {
  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: buttonState === "success",
    [classes.buttonError]: buttonState === "error",
  });

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <label htmlFor="upload-photo">
          <input
            hidden
            id="upload-photo"
            name="upload-photo"
            type="file"
            accept={fileType}
            onChange={onClickHandler}
          />
          <Fab
            aria-label="save"
            color="secondary"
            className={buttonClassname}
            component="span"
          >
            {buttonState === "none" ? <SaveIcon />
              : buttonState === "success" ? <CheckIcon /> : <ErrorIcon />}

          </Fab>
        </label>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}

      </div>
      <div className={classes.wrapper}>
        <label htmlFor="upload-photo">
          <input
            hidden
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={onClickHandler}
          />
          <Button
            color="secondary"
            variant="contained"
            component="span"
            className={buttonClassname}
            disabled={loading}
          >
            {textButton}
          </Button>
        </label>

        {helperText ? <Tooltip title={helperText} >
          <IconButton
            aria-label={"info" + textButton}
            edge="end">
            {<InfoIcon />}
          </IconButton>
        </Tooltip> : ""}

        {loading && <CircularProgress variant="determinate" value={progress} size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}

export default ProgressButtonWithInputFile;


const theme = createTheme();

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-flex',
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
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));