import React, { useState } from "react";

import { Grid, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import DeleteDialog from 'components/Dialogs/DeleteDialog';
import { Delete } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { toWithOutError } from "utils";
import { useDispatch } from 'react-redux';
import { deleteLabelRedux } from "redux/actions/LabelsActions";

const Label = ({ dataLabel }) => {

  const dispatch = useDispatch();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);

  const handleCloseDelete = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    setOpenLoader(true);
    let result = await toWithOutError(dispatch(deleteLabelRedux(dataLabel.fugaId, dataLabel.id, dataLabel.ownerId)));
    if (result === "ERROR") {
      // setButtonState("error");
      // setButtonText("Error");
      setOpenLoader(false);
      console.log("ERROR");
    }
    setOpenLoader(false);
    setOpenDeleteDialog(false);
  }

  return (
    <Grid container>

      <Grid item xs={12} sm={10}>

        <Card sx={cardElementStyle}>

          <CardContent>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography noWrap sx={cardTitleBlackStyles}>{dataLabel.name}</Typography>

              <Grid item xs={12} textAlign="-moz-center">
                <Divider sx={dividerStyle} />
              </Grid>

              <Grid sx={{ height: "2.5em" }}>
                <Typography noWrap sx={cardSubtitleBlackStyles}>{dataLabel.details}</Typography >
              </Grid>

            </Grid>
          </CardContent>

          <CardActions sx={{ justifyContent: "center" }}>
            <Grid item xs={8}>
              <Button
                endIcon={<Delete />}
                onClick={handleOpenDeleteDialog}
                fullWidth
                style={{ backgroundColor: "#c50e29", color: "white" }}>
                Eliminar
              </Button>
            </Grid>
          </CardActions>

        </Card>
      </Grid>

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Sello"} textName={dataLabel.name} textContent={"Confirma que quieres eliminar el Sello"}
        deleteAction={handleDelete} deleteButtonText={"Confirmar"} openLoader={openLoader}
      />
    </Grid>
  );
}

export default Label;

const cardElementStyle = {
  borderRadius: "30px",
  marginTop: "20px",
  width: "22em",
  height: "12em"
}
const cardSubtitleBlackStyles = {
  color: "rgba(0,0,0,0.5)",
  margin: "0",
  fontSize: "14px",
  marginTop: "1em",
  marginBottom: "0"
}

const cardTitleBlackStyles = {
  color: "rgba(0,0,0,1)",
  fontWeight: "300px",
  fontSize: "30px",
  marginBottom: "3px",
}

const dividerStyle = {
  width: "18em",
  borderColor: "rgba(0,0,0,0.2)",
  borderBottomWidth: "0.15em",
}
