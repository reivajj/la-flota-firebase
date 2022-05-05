import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarMui = ({ open, type, handleClose, autoHide, text, anchorOrigin }) => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={open}
        autoHideDuration={autoHide ? autoHide : null}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        >
        <Alert
          onClose={handleClose}
          severity={type}
          sx={{ width: '100%' }}>
          {text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default SnackbarMui;
