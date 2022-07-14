import React, { useState } from "react";
// import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import { AddCircleOutline } from '@mui/icons-material/';
import SelectDateInputDDMMYYYY from 'components/Input/SelectDateInputDDMMYYYY';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';

const EditOrAddFieldsDialog = (props) => {

  const { isOpen, handleCloseDialog, handleConfirm, title, subtitle, labelTextField, loading, buttonState, type, initialValues, optionsValues } = props;

  const [value, setValue] = useState(initialValues || "");
  const [dateValues, setDateValues] = useState(initialValues ? { ...initialValues } : "");
  const addCircleIcon = <AddCircleOutline />;

  const handlerDateUpdate = (eventValue, typeOfDate) => setDateValues({ ...dateValues, [typeOfDate]: eventValue });
  const handleChangeValue = event => {
    if (optionsValues && optionsValues.length > 0) {
      let newValueObject = optionsValues.find(valueObject => valueObject.name === event.target.value) || optionsValues[0];
      setValue(newValueObject);
    }
    else setValue(event.target.value)
  }

  return (
    <Dialog
      maxWidth={type === "date" ? "sm" : "xs"}
      fullWidth
      id="edit-or-add-dialog"
      open={isOpen}
      onClose={handleCloseDialog}>
      <DialogTitle id="edit-or-add-field-dialog-title">
        <Typography sx={{ fontSize: "1.5em", fontWeight: 500 }} component="span">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="edit-or-add-field-dialog-subtitle">
          {subtitle}
        </DialogContentText>

        {type !== "date" ?
          <TextFieldWithInfo
            name={labelTextField ? labelTextField : ""}
            fullWidth
            required
            label={labelTextField ? labelTextField : ""}
            value={optionsValues ? value.name || initialValues : value || initialValues || ""}
            onChange={handleChangeValue}
            select={(optionsValues && optionsValues.length > 0) ? true : false}
            autoFocus
            selectItems={optionsValues}
            selectKeyField="id"
            selectValueField="name"
          />
          : <SelectDateInputDDMMYYYY type="release-date" dayValue={dateValues.dayOfMonth} monthValue={dateValues.month} yearValue={dateValues.year}
            setDayOfMonth={event => handlerDateUpdate(event.target.value, "dayOfMonth")} setMonth={event => handlerDateUpdate(event.target.value, "month")}
            setYear={event => handlerDateUpdate(event.target.value, "year")} />
        }

      </DialogContent>

      <DialogActions id="edit-or-add-field-dialog-actions">
        <Grid container spacing={2}>

          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={buttonMainColor}
              fullWidth
              onClick={handleCloseDialog}
              color="primary">
              Atrás
            </Button>
          </Grid>

          <Grid item xs={6}>
            <ProgressButton
              textButton={"Confirmar"}
              loading={loading}
              buttonState={buttonState}
              onClickHandler={() => handleConfirm(type === "date" ? dateValues : value)}
              noneIcon={addCircleIcon}
              noFab={true}
              buttonFullWidth={true} />
          </Grid>

        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrAddFieldsDialog;

const buttonMainColor = { backgroundColor: "#9c27b0", '&:hover': { backgroundColor: "#9c27b0" } };

// EditFieldsDialog.defaultProps = {
//   isOpen: false,
//   textContent: "Confirma que quieres eliminar",
//   title: "Eliminar"
// }

// EditFieldsDialog.propTypes = {
//   textContent: PropTypes.string,
//   textName: PropTypes.string,
//   title: PropTypes.string.isRequired,
//   deleteButtonText: PropTypes.string,
//   isOpen: PropTypes.bool.isRequired,
//   setIsOpen: PropTypes.func.isRequired,
//   deleteAction: PropTypes.func.isRequired
// }