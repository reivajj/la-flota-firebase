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
import ArtistAddedIcon from '../Icons/ArtistAddedIcon';

const deleteArtistDialogText = "Confirma que quieres eliminar al Artista. No podrás eliminarlo si está en uso, deberás eliminar primero el Lanzamiento en el que esté el Artista."

const ArtistCard = ({ dataArtist, index }) => {
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
    let result = await toWithOutError(dispatch(deleteArtistRedux(dataArtist, dataArtist.id, dataArtist.fugaId, dataArtist.ownerId)));
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
  const handleGoToArtistAlbums = () => navigate(`/admin/albums?view=allOfArtist&id=${dataArtist.id}`);

  const handleGoToArtistLabels = () => {
    console.log("LABELS");
  }

  return (
    <>
      <Card sx={cardElementStyle}>

        <CardContent sx={{ height: "55%" }}>
          <Grid item xs={12} sx={{ height: "100%" }}>
            {dataArtist.imagenUrl
              ? <Image
                style={imageStyle}
                alt="artist-image"
                duration={30}
                src={dataArtist.imagenUrl}
              />
              : <ArtistAddedIcon sx={artistAddedIconStyle} asIconButton={false} />
            }
          </Grid>
        </CardContent>

        <CardContent style={{ padding: '6px', height: '25%' }}>
          <Grid container sx={{ textAlign: "center" }} padding={2}>

            <Grid item xs={12} textAlign="-moz-center">
              <Typography noWrap sx={cardTitleBlackStyles}>{dataArtist.name}</Typography>
            </Grid>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid container item xs={12} textAlign="left" sx={{ paddingTop: "1em", paddingBottom: 0, whiteSpace: "nowrap" }}>
              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Biografía:</b><b style={cardBioValueStyle}>{` ${dataArtist.biography}`}</b>
              </Grid>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Apple ID:</b><b style={cardCodeTextStyle} >{` ${dataArtist.apple_id ? dataArtist.apple_id : "será asignado por Apple"}`}</b>
              </Grid>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Spotify URI:</b><b style={cardCodeTextStyle} >{` ${dataArtist.spotify_uri ? dataArtist.spotify_uri : "será asignado por Spotify"}`}</b>
              </Grid>
            </Grid>


          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", height: '12%' }}>

          <Grid container spacing={1} justifyContent="center">

            <Grid container item spacing={2} xs={12}>
              <Grid item xs={12}>
                <Button
                  sx={{ width: "90%" }}
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToArtistAlbums}
                >
                  Albums
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
    </>
  );
}

export default ArtistCard;

const imageStyle = { borderRadius: "30px", marginTop: "7%", width: "100%", height: "100%" };
const cardElementStyle = { borderRadius: "30px", marginTop: "7%", width: "95%", height: "95%" };
const cardTitleBlackStyles = { color: "rgba(0,0,0,1)", fontWeight: "300px", fontSize: "30px", marginBottom: "3px" };
const dividerStyle = { width: "90%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const artistAddedIconStyle = { borderRadius: "30px", marginTop: "7%", width: "100%", height: "100%" };
const cardDSPNameStyles = { color: "rgba(0,0,0,0.9)", margin: "0", fontWeight: 600, fontSize: "14px", marginTop: "1em", marginBottom: "0" };
const cardCodeTextStyle = { color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "14px", marginTop: "1em", marginBottom: "0" };
const cardBioValueStyle = { color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "14px", marginTop: "1em", marginBottom: "0" };