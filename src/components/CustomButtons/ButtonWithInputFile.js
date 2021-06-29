import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Button from "components/CustomButtons/Button.js";

const ButtonWithInputFile = ({ textButton, onClickHandler, fileType, color }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <label htmlFor="upload-track">
          <input
            hidden
            id="upload-track"
            name="upload-track"
            type="file"
            accept={fileType}
            onChange={onClickHandler}
          />
          <Button
            color={color}
            variant="contained"
            component="span">
            {textButton}
          </Button>
        </label>
      </div>
    </div>
  );
}

export default ButtonWithInputFile;

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