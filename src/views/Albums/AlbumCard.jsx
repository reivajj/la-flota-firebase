import React, { useState, useEffect } from "react";
import { Image } from 'mui-image';
import { Delete, Edit } from '@mui/icons-material';
import DeleteDialog from "components/Dialogs/DeleteDialog";
import { Divider, Link, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toWithOutError } from 'utils';
import { useDispatch } from 'react-redux';
// core components
import { Grid, Typography, Card, CardContent, CardActions, IconButton, Button } from '@mui/material';
import { deleteAlbumDialogText } from "utils/textToShow.utils";
import { deleteAlbumRedux } from "redux/actions/AlbumsActions";
// import { useFetch } from '../../customHooks/useFetch';
// import { createImageFromUrlData } from 'utils/albums.utils';
// import { targetUrl } from 'services/BackendCommunication';

const AlbumCard = ({ dataAlbum, imageType }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("IMAGE TYPE: ", imageType);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLoaderDelete, setOpenLoaderDelete] = useState(false);
  const [buttonText, setButtonText] = useState("Confirmar");
  const [buttonState, setButtonState] = useState("delete");
  // const [imageAsUrlData, setImageAsUrlData] = useState("");

  // const urlFugaImageAlbum = dataAlbum.fugaId && `${targetUrl}albums/${dataAlbum.fugaId}/image/${imageType}`;

  // let imageFetch = useFetch(imageType === "firebase" ? "" : urlFugaImageAlbum);
  // console.log("IMAGE FETCH OUT EFFECT: ", imageFetch);
  // let imageFetchStatus = imageFetch.status || ""; let imageFetchData = imageFetch.data || "";

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDelete = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    setOpenLoaderDelete(true);
    let result = await toWithOutError(dispatch(deleteAlbumRedux(dataAlbum)));
    if (result === "ERROR") {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoaderDelete(false);
    }
    else {
      setOpenLoaderDelete(false);
      setOpenDeleteDialog(false);
    }
  }

  // useEffect(() => {
  //   if (imageType === "firebase") setImageAsUrlData(dataAlbum.imagenUrl);
  // }, [imageType])

  // useEffect(() => {
  //   if (imageFetchStatus === "error") console.log("ERROR Fetching image: ", imageFetch.error);
  //   if (imageFetchStatus === "fetching") setImageAsUrlData("");
  //   if (imageFetchStatus === "fetched") getFugaAlbumCoverImageFUGA();
  // }, [imageFetchStatus])

  const handleEditAlbum = () => navigate(`/admin/albums/${dataAlbum.id}?edit=true`);
  const goToLabelAlbum = () => navigate(`/admin/labels?view=label&label_name=${dataAlbum.label_name}`);
  const goToPrincipalArtist = () => navigate(`/admin/artists?view=artist&id=${dataAlbum.artistId}`);

  // const getFugaAlbumCoverImageFUGA = async () => {
  //   const imageObjectURL = await createImageFromUrlData(imageFetchData);
  //   setImageAsUrlData(imageObjectURL);
  // }

  const linkToSello = <Link component="button" underline="hover" sx={linkToLabelStyles} onClick={goToLabelAlbum}  >
    {dataAlbum.label_name}
  </Link>

  let targetOriginUrl = window.location.origin === "http://localhost:3001" ? "http://localhost:3001" : "https://app.laflota.com.ar";

  return (
    <>
      <Card sx={cardElementStyle}>

        <CardContent sx={{ height: "250px", textAlign: "-moz-center" }}>
          <Grid item xs={12} sx={{ height: "100%" }}>
            {dataAlbum.imagenUrl ? (
              <Image
                style={imageStyle}
                alt="album-image"
                duration={30}
                src={dataAlbum.imagenUrl}
              />
            ) : <Skeleton sx={{ borderRadius: "20px" }} animation="wave" variant="rectangular" width={250} height={250} />}
          </Grid>
        </CardContent>

        <CardContent style={{ padding: '0', height: '200px' }}>
          <Grid container textAlign="center" justifyContent="center">

            <Grid item xs={12} textAlign="-moz-center">
              <Typography noWrap sx={cardTitleBlackStyles}>{dataAlbum.title}</Typography>
            </Grid>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid sx={{ marginTop: "0.5em" }}>
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

            <Grid item xs={12} textAlign="-moz-center" sx={{ paddingTop: "0.5em" }}>
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

        <CardActions sx={{ justifyContent: "center", height: '100px' }}>

          <Grid container spacing={2} justifyContent="center">

            <Grid item xs={8}>
              <Button
                fullWidth
                href={`${targetOriginUrl}/admin/albums/${dataAlbum.id}`}
                target="_blank"
                variant="contained"
                color="secondary"
              >
                Ir a álbum
              </Button>
            </Grid>

            <Grid container item direction="row" justifyContent="space-between" alignItems="flex-end" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" key="delete" onClick={handleOpenDeleteDialog}>
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" onClick={handleEditAlbum}>
                  <Edit fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
            {/* <Grid container item direction="row" justifyContent="center" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" key="delete" onClick={handleOpenDeleteDialog}>
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid> */}

          </Grid>
        </CardActions>
      </Card>

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Lanzamiento"} textName={dataAlbum.title} textContent={deleteAlbumDialogText}
        deleteAction={handleDelete} deleteButtonText={buttonText} openLoader={openLoaderDelete} buttonState={buttonState}
      />
    </>
  );
}

export default AlbumCard;

const imageStyle = { borderRadius: "20px", width: "250px", height: "250px" };
const cardElementStyle = { borderRadius: "30px", marginTop: "2%", width: "95%", height: "100%" };
const cardSubtitleBlackStyles = { color: "rgba(0,0,0,0.8)", margin: "0", fontSize: "20px", marginBottom: "0" };
const cardTitleBlackStyles = { color: "rgba(0,0,0,1)", fontWeight: "300px", fontSize: "30px", marginBottom: "3px", width: "90%" };
const dividerStyle = { width: "90%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const linkToArtistStyles = { fontSize: "18px" }
const linkToLabelStyles = { fontSize: "16px" }
const cardDSPNameStyles = { color: "rgba(0,0,0,0.9)", margin: "0", fontWeight: 600, fontSize: "16px", marginTop: "1em", marginBottom: "0" };
const cardCodeTextStyle = { color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "16px", marginTop: "1em", marginBottom: "0" };