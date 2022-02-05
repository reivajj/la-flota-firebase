import React, { useState } from "react";
import { Image } from 'mui-image';
import { Delete, Edit } from '@mui/icons-material';
import DeleteDialog from "components/Dialogs/DeleteDialog";
import { Divider, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toWithOutError } from 'utils';
import { useDispatch } from 'react-redux';
// core components
import { Grid, Typography, Card, CardContent, CardActions, IconButton, Button } from '@mui/material';
import { deleteAlbumDialogText } from "utils/textToShow.utils";
import { deleteAlbumRedux } from "redux/actions/AlbumsActions";

const AlbumCard = ({ dataAlbum }) => {

  console.log("DATA ALBUM: ", dataAlbum);

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
    let result = await toWithOutError(dispatch(deleteAlbumRedux(dataAlbum.id, dataAlbum.fugaId, dataAlbum.ownerId)));
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

  const handleEditAlbum = () => navigate(`/admin/edit-album/${dataAlbum.id}`);
  const goToAlbumInfo = () => console.log("ALBUM INFO");
  const goToPrincipalArtist = () => console.log("Principal artist");

  // const getAllArtistsNames = () => {
  //   const artistasPrincipalesNames = [dataAlbum.nombreArtist, ...dataAlbum.allOtherArtists.map(otherArtist => otherArtist.name)];
  //   let artistasPrincipalesNamesString = "";
  //   artistasPrincipalesNames.forEach((artistName, index) => {
  //     if (index === 0) artistasPrincipalesNamesString = artistasPrincipalesNamesString + artistName;
  //     else artistasPrincipalesNamesString = artistasPrincipalesNamesString + ", " + artistName;
  //   })
  // }

  return (
    <Grid container justifyContent="center">
      <Card sx={cardElementStyle}>

        <CardContent>
          <Grid item xs={12}>
            {dataAlbum.imagenUrl && (
              <Grid >
                <Image
                  style={imageStyle}
                  alt="album-image"
                  duration={30}
                  src={dataAlbum.imagenUrl}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>

        <CardContent>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography noWrap sx={cardTitleBlackStyles}>{dataAlbum.title}</Typography>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid sx={{ height: "2.5em" }}>
              <Typography noWrap sx={cardSubtitleBlackStyles}>
                {`Artistas Principales:`}
                <br />
                <Link
                  component="button"
                  underline="hover"
                  sx={linkToArtistStyles}
                  onClick={goToPrincipalArtist}
                >
                  {dataAlbum.nombreArtist}
                </Link>
              </Typography >
            </Grid>

          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", marginTop: "2%" }}>

          <Grid container spacing={2} justifyContent="center">

            <Grid item xs={8}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={goToAlbumInfo}
              >
                Ir a Album
              </Button>
            </Grid>

            <Grid container item direction="row" justifyContent="space-between" alignItems="flex-end" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" onClick={handleOpenDeleteDialog}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" onClick={handleEditAlbum}>
                  <Edit fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>

          </Grid>
        </CardActions>
      </Card>

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Artista"} textName={dataAlbum.title} textContent={deleteAlbumDialogText}
        deleteAction={handleDelete} deleteButtonText={buttonText} openLoader={openLoader} buttonState={buttonState}
      />
    </Grid >
  );
}

export default AlbumCard;

const imageStyle = { borderRadius: "30px", marginTop: "20px", width: "15em", height: "15em" };
const cardElementStyle = { borderRadius: "30px", marginTop: "20px", width: "22em", height: "34em" };
const cardSubtitleBlackStyles = { color: "rgba(0,0,0,0.8)", margin: "0", fontSize: "20px", marginTop: "1em", marginBottom: "0" };
const cardTitleBlackStyles = { color: "rgba(0,0,0,1)", fontWeight: "300px", fontSize: "30px", marginBottom: "3px" };
const dividerStyle = { width: "18em", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const linkToArtistStyles = { fontSize: "18px" }