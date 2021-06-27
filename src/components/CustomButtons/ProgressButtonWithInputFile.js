import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import ErrorIcon from '@material-ui/icons/Error';

const ProgressButtonWithInputFile = ({ textButton, loading, buttonState, onClickHandler, progress }) => {
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
            onChange={onClickHandler}
          />
          <Fab
            aria-label="save"
            color="primary"
            className={buttonClassname}
            onClick={onClickHandler}
          >
            {buttonState === "none" ? <SaveIcon />
              : buttonState === "success" ? <CheckIcon /> : <ErrorIcon />}

          </Fab>
        </label>
        {loading && <CircularProgress variant="determinate" value={progress} size={68} className={classes.fabProgress} />}

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
            color="primary"
            variant="contained"
            component="span"
            className={buttonClassname}
            disabled={loading}>
            {textButton}
          </Button>
        </label>
        {loading && <CircularProgress variant="determinate" value={progress} size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}

export default ProgressButtonWithInputFile;

const useStyles = makeStyles((theme) => ({
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