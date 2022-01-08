import React, { useState } from "react";
import { Grid, Typography, Card, CardContent, CardActions, IconButton, Button } from '@mui/material';
import { Image } from 'mui-image';
import { Delete, Edit } from '@mui/icons-material';
import DeleteDialog from "components/Dialogs/DeleteDialog";
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toWithOutError } from 'utils';
import { useDispatch } from 'react-redux';
import { deleteArtistRedux } from "redux/actions/ArtistsActions";

const deleteArtistDialogText = "Confirma que quieres eliminar al Artista. No podrás eliminarlo si está en uso, deberás eliminar primero el Album en el que esté el Artista."

const Artist = ({ dataArtist, index }) => {
  console.log("DATAARTIST: ", dataArtist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [buttonText, setButtonText] = useState("Confirmar");
  const [buttonState, setButtonState] = useState("delete");

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDelete = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    setOpenLoader(true);
    let result = await toWithOutError(dispatch(deleteArtistRedux(dataArtist.id, dataArtist.fugaId, dataArtist.ownerId)));
    if (result === "ERROR") {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
    else {
      setOpenLoader(false);
      setOpenDeleteDialog(false);
    }
  }

  const handleEditArtista = () => navigate(`/admin/edit-artist/${dataArtist.id}`);

  const handleGoToArtistAlbums = () => {
    console.log("Albums");
  }

  const handleGoToArtistLabels = () => {
    console.log("LABELS");
  }

  return (
    <Grid container justifyContent="center">

      <Card sx={cardElementStyle}>

        <CardContent>
          <Grid item xs={12}>
            {dataArtist.imagenUrl && (
              <Grid >
                <Image
                  style={imageStyle}
                  alt="artist-image"
                  duration={30}
                  src={dataArtist.imagenUrl}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>

        <CardContent>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography noWrap sx={cardTitleBlackStyles}>{dataArtist.name}</Typography>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid sx={{ height: "2.5em" }}>
              <Typography noWrap sx={cardSubtitleBlackStyles}>{dataArtist.biography}</Typography >
            </Grid>

          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>

          <Grid container spacing={1} justifyContent="center">

            <Grid container item spacing={2} xs={12}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToArtistAlbums}
                >
                  Albums
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToArtistLabels}
                >
                  Sellos
                </Button>
              </Grid>
            </Grid>

            <Grid container item direction="row" justifyContent="space-between" alignItems="flex-end" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" onClick={handleOpenDeleteDialog}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" onClick={handleEditArtista}>
                  <Edit fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </CardActions>

      </Card>

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Artista"} textName={dataArtist.name} textContent={deleteArtistDialogText}
        deleteAction={handleDelete} deleteButtonText={buttonText} openLoader={openLoader} buttonState={buttonState}
      />
    </Grid>
  );
}

export default Artist;

const imageStyle = {
  borderRadius: "30px",
  marginTop: "20px",
  width: "15em",
  height: "15em"
}

const cardElementStyle = {
  borderRadius: "30px",
  marginTop: "20px",
  width: "22em",
  height: "32em"
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
