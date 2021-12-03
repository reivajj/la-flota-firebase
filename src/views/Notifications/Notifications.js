import React, { useState, useEffect } from "react";

import SnackbarMui from "components/Snackbar/SnackbarMui";
import { useSelector, useDispatch } from 'react-redux';
import { cleanError } from '../../redux/actions/ErrorHandlerActions';

const Notifications = () => {

  const errorHandler = useSelector(store => store.errorHandler);
  const dispatch = useDispatch();

  const notErrorHandler = () => {
    setOpenNotification(false);
  }

  const handleCloseErrorNotification = () => {
    dispatch(cleanError());
    setOpenNotification(false);
  }

  const [openNotification, setOpenNotification] = useState(false);
  // TYPES: warning, info, success, error
  const [notificationType, setNotificationType] = useState("none");
  const [notiText, setNotiText] = useState("");

  // Error notification si el centralized error handler activa un error.
  useEffect(() => {
    if (errorHandler.error) {
      setNotificationType("error");
      setNotiText(errorHandler.errorMessage)
      setOpenNotification(true);
    }
  }, [errorHandler.error]);

  const handleClose = notificationType === "error" ? handleCloseErrorNotification : notErrorHandler;
  const autoHide = !(notificationType === "error");

  return (
    <SnackbarMui
      open={openNotification}
      setOpen={setOpenNotification}
      type={notificationType}
      handleClose={handleClose}
      autoHide={autoHide}
      text={notiText} />
  );
}

export default Notifications;