import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { green, red } from '@mui/material/colors';
// import Button from "components/CustomButtons/Button.js";
import { createTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

const ButtonWithInputFile = ({ textButton, onClickHandler, fileType, color }) => {
  const buttonAdd = { backgroundColor: color, '&:hover': { backgroundColor: color } }
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
            sx={buttonAdd}
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