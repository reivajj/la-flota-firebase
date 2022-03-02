import React, { useState } from "react";
import { Image } from 'mui-image';
import { Delete } from '@mui/icons-material';
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
    let result = await toWithOutError(dispatch(deleteAlbumRedux(dataAlbum)));
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

  // const handleEditAlbum = () => navigate(`/admin/edit-album/${dataAlbum.id}`);
  const goToAlbumInfo = () => navigate(`/admin/albums/${dataAlbum.id}`);
  const goToLabelAlbum = () => navigate(`/admin/labels?view=label&label_name=${dataAlbum.label_name}`);
  const goToPrincipalArtist = () => navigate(`/admin/artists?view=artist&id=${dataAlbum.artistId}`);

  const linkToSello = <Link component="button" underline="hover" sx={linkToLabelStyles} onClick={goToLabelAlbum}  >
    {dataAlbum.label_name}
  </Link>

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

        <CardContent style={{ padding: '6px' }}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>

            <Grid item xs={12} textAlign="-moz-center">
              <Typography noWrap sx={cardTitleBlackStyles}>{dataAlbum.title}</Typography>
            </Grid>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid >
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

            <Grid item xs={12} textAlign="-moz-center" sx={{ paddingTop: "1em" }}>
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid container item xs={12} textAlign="center" sx={{ paddingTop: "0.5em", paddingBottom: 0 }}>
              <Grid item xs={6} >
                <b style={cardDSPNameStyles}>UPC </b><br /><b style={cardCodeTextStyle} >{dataAlbum.upc || ""}</b>
              </Grid>

              <Grid item xs={6} >
                <b style={cardDSPNameStyles}>Sello </b><br /><Typography noWrap>{linkToSello}</Typography>
              </Grid>
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
                Ir a álbum
              </Button>
            </Grid>

            <Grid container item direction="row" justifyContent="center" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" key="delete" onClick={handleOpenDeleteDialog}>
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

          </Grid>
        </CardActions>
      </Card>

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Lanzamiento"} textName={dataAlbum.title} textContent={deleteAlbumDialogText}
        deleteAction={handleDelete} deleteButtonText={buttonText} openLoader={openLoader} buttonState={buttonState}
      />
    </Grid >
  );
}

export default AlbumCard;

const imageStyle = { borderRadius: "30px", marginTop: "20px", width: "15em", height: "15em" };
const cardElementStyle = { borderRadius: "30px", marginTop: "20px", width: "22em", height: "38em" };
const cardSubtitleBlackStyles = { color: "rgba(0,0,0,0.8)", margin: "0", fontSize: "20px", marginTop: "1em", marginBottom: "0" };
const cardTitleBlackStyles = { color: "rgba(0,0,0,1)", fontWeight: "300px", fontSize: "30px", marginBottom: "3px" };
const dividerStyle = { width: "18em", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const linkToArtistStyles = { fontSize: "18px" }
const linkToLabelStyles = { fontSize: "16px" }
const cardDSPNameStyles = { color: "rgba(0,0,0,0.9)", margin: "0", fontWeight: 600, fontSize: "16px", marginTop: "1em", marginBottom: "0" };
const cardCodeTextStyle = { color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "16px", marginTop: "1em", marginBottom: "0" };