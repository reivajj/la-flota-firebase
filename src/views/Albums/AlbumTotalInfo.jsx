import React, { useState, useEffect } from "react";
import { Image } from 'mui-image';
import { useParams } from 'react-router-dom';
// core components
import { Grid, Skeleton, Typography, Card, ButtonBase, IconButton, CircularProgress, Backdrop, Button } from '@mui/material';
// import { deleteAlbumDialogText } from "utils/textToShow.utils";
// import { deleteAlbumRedux } from "redux/actions/AlbumsActions";
import { useSelector, useDispatch } from 'react-redux';
import { getAlbumById, getStateColor, getOurStateFromFugaState, createImageFromUrlData } from "utils/albums.utils";
import { targetUrl } from "services/BackendCommunication";
import { useAxios } from '../../customHooks/useAxios';
import { getLocalDateString } from '../../utils/timeRelated.utils';
import TracksTableInAlbumInfo from '../../components/Table/TracksTableInAlbumInfo';
import ArtistInAddTrack from '../Artists/ArtistInAddTrack';
// import { NewTrackDialog } from 'views/Tracks/NewTrackDialog';
import { getTracksDataTableFromFugaAssets } from '../../utils/tables.utils';
import { Link as LinkIcon } from '@mui/icons-material';
import LiveLinksDialog from './LiveLinksDialog';
import { toWithOutError } from 'utils';
import { albumGetLiveLinkRedux, albumsRedeliverAll } from "redux/actions/AlbumsActions";
import InfoDialog from '../../components/Dialogs/InfoDialog';
import EditOrAddFieldsDialog from '../../components/Dialogs/EditOrAddFieldDialog';
import { Edit } from '@mui/icons-material/';
import useQuery from '../../customHooks/useQuery';
import { useNavigate } from 'react-router';
import { albumsEditRedux, albumsUploadCoverRedux } from '../../redux/actions/AlbumsActions';
import SuccessDialog from 'components/Dialogs/SuccessDialog';
import { useFetch } from '../../customHooks/useFetch';
import { userIsAdmin } from 'utils/users.utils';
import { areMissingTracksFuga } from '../../utils/tracks.utils';
import useWindowDimensions from '../../customHooks/useWindowDimensions';

const AlbumTotalInfo = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const queryString = useQuery();
  const userEmail = useSelector(store => store.userData.email);
  const userData = useSelector(store => store.userData);
  const albums = useSelector(store => store.albums.albums);
  const dataAlbum = getAlbumById(albums, params.albumId);
  const { width } = useWindowDimensions();

  console.log("DATA ALBUM : ", dataAlbum);

  const [buttonState, setButtonState] = useState("none");
  const [imageAsUrlData, setImageAsUrlData] = useState("");
  const [openLiveLinksDialog, setOpenLiveLinksDialog] = useState("idle");
  const [liveLinksInfo, setLiveLinksInfo] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [openErrorSearch, setOpenErrorSearch] = useState(false);
  const [isEditing, setIsEditing] = useState(queryString.edit);
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false, beginner: "", title: "", subtitle: [""]
  });

  const urlFugaAlbum = dataAlbum.fugaId && `${targetUrl}albums/${dataAlbum.fugaId}`;
  const albumFetch = useAxios(urlFugaAlbum);
  let albumFugaData = albumFetch.data; let albumFugaStatus = albumFetch.status;

  const urlFugaImageAlbum = dataAlbum.fugaId && `${targetUrl}albums/${dataAlbum.fugaId}/image/muse_list_view`;
  let imageFetch = useFetch(urlFugaImageAlbum);
  let imageFetchStatus = imageFetch.status; let imageFetchData = imageFetch.data;

  let audioTracksMissing = albumFugaStatus === "fetched" ? areMissingTracksFuga(albumFugaData.assets) : false;
  let albumState = audioTracksMissing ? "TRACKS_MISSING" : albumFugaData.state ? albumFugaData.state : "";

  const stateInfoStyle = { color: getStateColor(albumState), fontSize: "1em", fontWeight: 500 };

  // imageFetchStatus === "fetched" && console.log("image albumFuga: ", imageFetchData);
  // albumFugaStatus === "fetched" && console.log("albumFugaData albumFuga: ", albumFugaData);

  const getFugaAlbumCoverImageFUGA = async () => {
    const imageObjectURL = await createImageFromUrlData(imageFetchData);
    setImageAsUrlData(imageObjectURL);
  }

  useEffect(() => {
    if (albumFugaStatus === "error") { setOpenLoader(false); setOpenErrorSearch(true) }
    if (albumFugaStatus === "fetching") setOpenLoader(true);
    if (albumFugaStatus === "fetched") setOpenLoader(false);
  }, [albumFugaStatus])

  useEffect(() => {
    if (imageFetchStatus === "error") { setOpenLoader(false); setOpenErrorSearch(true) }
    if (imageFetchStatus === "fetching") setOpenLoader(true);
    if (imageFetchStatus === "fetched") getFugaAlbumCoverImageFUGA();
  }, [imageFetchStatus])

  const handleOpenLiveLinks = async () => {
    setOpenLoader(true);
    let liveLinksResponse = await toWithOutError(dispatch(albumGetLiveLinkRedux(dataAlbum)));
    if (liveLinksResponse === "ERROR") setOpenLiveLinksDialog("error");
    if (liveLinksResponse.length === 0) setOpenLiveLinksDialog("not found yet");
    if (liveLinksResponse.length > 0) {
      setOpenLoader(false);
      setLiveLinksInfo(liveLinksResponse);
      setOpenLiveLinksDialog("founded");
    }
    setOpenLoader(false);
  }

  // const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);
  // const [trackData, setTrackData] = useState({});

  // const handleEditTrack = trackFuga => {
  //   setTrackData(getTracksFieldsFromFugaTrack(trackFuga));
  //   setOpenNewTrackDialog(true);
  // }

  // const handleDeleteTrack = () => {
  //   console.log("Handle delete track");
  // }

  const tracksDataTable = albumFugaStatus === "fetched" ? getTracksDataTableFromFugaAssets(albumFugaData.assets) : [];
  const albumArtists = albumFugaStatus === "fetched" ? albumFugaData.artists : [];
  // const goToLabelAlbum = () => navigate(`/admin/labels?view=label&label_name=${dataAlbum.label_name}`);
  // const goToPrincipalArtist = () => navigate(`/admin/artists?view=artist&id=${dataAlbum.artistId}`);

  // const linkToSello = <Link component="button" underline="hover" sx={linkToLabelStyles} onClick={goToLabelAlbum}  >
  //   {dataAlbum.label_name}
  // </Link>

  const handleCloseEditDialog = () => setOpenEditDialog({ open: false, title: "", subtitle: [""] });

  const handleConfirmEditAlbum = async (newValue, fieldName) => {
    setButtonState("loading");
    let editResult = await toWithOutError(dispatch(albumsEditRedux(dataAlbum,
      fieldName === "date" ? { ...newValue } : { [fieldName]: newValue }, userEmail, true)));
    if (editResult === "ERROR") { setButtonState("error"); return; }
    setButtonState("none");
    setOpenEditDialog({ open: false, title: "", subtitle: "" });
  }

  const handleEditTitle = () => setOpenEditDialog({
    open: true, title: "Nuevo título", subtitle: [""], handleConfirm: (newValue) => handleConfirmEditAlbum(newValue, 'title'),
    initialValues: dataAlbum.title
  });

  const handleEditReleaseDate = () => setOpenEditDialog({
    open: true, type: "date", title: "Modifica la fecha de lanzamiento", subtitle: [""]
    , handleConfirm: (newDate) => handleConfirmEditAlbum(newDate, 'date')
    , initialValues: { dayOfMonth: dataAlbum.dayOfMonth, month: dataAlbum.month, year: dataAlbum.year }
  })

  const goToPrincipalArtist = () => navigate(`/admin/edit-artist/${dataAlbum.artistId}`);

  const handleEditOrRedeliver = async () => {
    if (!isEditing) { setIsEditing(true); return };
    setOpenLoader(true);
    let resultRedeliver = await toWithOutError(dispatch(albumsRedeliverAll(dataAlbum)));
    if (resultRedeliver === "ERROR") { setOpenLoader(false); setOpenErrorSearch(true); return; }
    setOpenLoader(false); setButtonState("success"); setIsEditing(false);
  }

  const handleClickCover = async () => {
    // let coverFugaId = albumFugaData.
    // let uploadCoverResponse = await toWithOutError(dispatch(albumsUploadCoverRedux(dataAlbum.fugaId, dataAlbum.id, )))
  }

  return (
    <Grid container justifyContent="center">

      <Backdrop open={openLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <SuccessDialog isOpen={buttonState === "success"} title={`Se ha realizado el Redelivery de tu lanzamiento`}
        contentTexts={[[`Los cambios que has hecho se verán reflejados en las tiendas en los próximos días.`]]}
        handleClose={() => setButtonState("none")} successImageSource="/images/successArtists.jpg" />

      <EditOrAddFieldsDialog isOpen={openEditDialog.open} handleCloseDialog={handleCloseEditDialog} handleConfirm={openEditDialog.handleConfirm}
        title={openEditDialog.title} subtitle={openEditDialog.subtitle} loading={buttonState === "loading"}
        buttonState={buttonState} initialValues={openEditDialog.initialValues} type={openEditDialog.type || ""} datesInfo={openEditDialog.datesInfo} />

      <InfoDialog isOpen={openErrorSearch} handleClose={() => setOpenErrorSearch(false)}
        title={"Hubo un error al traer la información del lanzamiento."} contentTexts={["Por favor, intente nuevamente."]} />

      <LiveLinksDialog isOpen={openLiveLinksDialog !== "idle"} handleClose={() => setOpenLiveLinksDialog("idle")}
        liveLinksInfo={liveLinksInfo} />

      {/* {openNewTrackDialog && <Grid item xs={12}>
          <NewTrackDialog openDialog={openNewTrackDialog} setOpenNewTrackDialog={setOpenNewTrackDialog} trackData={trackData} />
        </Grid>} */}

      {userIsAdmin(userData.rol) && <Grid item xs={12} textAlign='center' padding={2}>
        <Typography>{`ID EN LA APP DEL ALBUM: ${dataAlbum.id}`}</Typography>
      </Grid>}

      <Card sx={cardElementStyle}>

        <Grid container>

          <Grid item>
            <ButtonBase sx={{ width: "320px", height: "100%" }} onClick={handleClickCover}>
              {imageAsUrlData ? <Image
                style={imageStyle}
                alt="album-image"
                duration={30}
                src={imageAsUrlData}
              /> : <Skeleton sx={{ borderRadius: "20px" }} animation="wave" variant="rectangular" width={320} height={320} />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} container sm>
            <Grid item xs container direction="column" >

              <Grid item xs>

                <Grid container item xs sx={{ height: "20%", marginLeft: isEditing ? "0" : "2%" }}>
                  {isEditing && <Grid item xs sx={{ width: "5%", marginTop: "12px" }}>
                    <IconButton
                      size='small'
                      aria-label='editar campo: Nombre'
                      onClick={handleEditTitle}>
                      <Edit />
                    </IconButton>
                  </Grid>}
                  <Grid item sx={{ width: "95%" }}>
                    <Typography noWrap sx={{ ...titleAlbumStlye, width: width < 1200 ? "300px" : "700px", fontSize: width < 1200 ? "1.5em" : "2.5em" }}
                      gutterBottom>{dataAlbum.title}</Typography>
                  </Grid>
                </Grid>

                <Grid container item xs sx={{ height: "13.3%", marginLeft: isEditing ? "0" : "2%" }}>
                  {isEditing && <Grid item xs sx={{ maxWidth: "5%" }}>
                    <IconButton
                      size='small'
                      aria-label='editar campo: Artista'
                      onClick={goToPrincipalArtist}>
                      <Edit />
                    </IconButton>
                  </Grid>}
                  <Grid item sx={{ width: "95%", marginTop: isEditing ? "5px" : 0 }}>
                    <Typography variant="body2" gutterBottom sx={artistTextStyle}>
                      {`${albumArtists.length > 1 ? "Artistas" : "Artista"}: ${albumFugaStatus === 'fetched' ? albumFugaData.display_artist : ""}`}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ marginLeft: isEditing ? "5%" : "2%", height: "13.3%" }} >
                  <Typography ><b style={selloTextStyle}>Sello: </b>{`${albumFugaStatus === 'fetched' ? albumFugaData.label.name : ""}`}</Typography>
                </Grid>

                <Grid item xs={12} sx={{ marginLeft: isEditing ? "5%" : "2%", height: "13.3%" }} >
                  <Typography sx={moreInfoTextStyle}>
                    {`UPC: ${albumFugaStatus === "fetched" ? albumFugaData.upc || "" : ""}`}
                  </Typography>
                </Grid>


                <Grid item xs={12} sx={{ marginLeft: isEditing ? "5%" : "2%", height: "13.3%" }} >
                  <Typography sx={moreInfoTextStyle}>
                    {`Fecha de creación: ${albumFugaStatus === "fetched" ? getLocalDateString(albumFugaData.created_date) : ""}`}
                  </Typography>
                </Grid>

                <Grid container item xs sx={{ height: "13.3%", marginLeft: isEditing ? "0" : "2%" }}>
                  {isEditing && <Grid item xs sx={{ maxWidth: "5%" }}>
                    <IconButton
                      size='small'
                      aria-label='editar campo: Fecha Lanzamiento'
                      onClick={handleEditReleaseDate}>
                      <Edit />
                    </IconButton>
                  </Grid>}
                  <Grid item sx={{ width: "95%", marginTop: isEditing ? "5px" : 0 }} >
                    <Typography sx={moreInfoTextStyle}>
                      {`Fecha de lanzamiento: ${dataAlbum.dayOfMonth}/${dataAlbum.month}/${dataAlbum.year}`}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container item xs sx={{ height: "13.3%", marginLeft: isEditing ? "5%" : "2%" }}>
                  <Grid item sx={{ width: albumState === "PUBLISHED" ? "300px" : "270px", marginTop: "8px" }}>
                    <Typography sx={stateInfoStyle}>
                      {`Estado: ${albumFugaStatus === "fetched" ? getOurStateFromFugaState(albumState) : ""}`}
                    </Typography>
                  </Grid>

                  {albumFugaData.state === "DELIVERED" && <Grid item xs={1}>
                    <IconButton sx={linkIconStyle} color="inherit" fontSize="large" key="link" onClick={handleOpenLiveLinks}>
                      <LinkIcon fontSize="large" />
                    </IconButton>
                  </Grid>}
                </Grid>

              </Grid>

            </Grid>

            <Grid item padding={2}>
              <Button variant="contained" onClick={handleEditOrRedeliver} sx={buttonColorStyle} >
                {isEditing ? 'Guardar y Redistribuir' : 'Editar'}
              </Button>
            </Grid>

          </Grid>

        </Grid>

      </Card >

      <Grid container justifyContent='center' padding={1}>
        <TracksTableInAlbumInfo sxCard={{ width: "80em", borderRadius: '30px' }} tracksTableData={tracksDataTable}
          handleClickAddTrack={() => console.log("Add track")} />
      </Grid>


      <Card sx={{ width: '80em', borderRadius: "30px" }}>

        <Grid item xs={12} padding="1em 1em 0em">
          <Typography sx={artistsTitleStyle}>{`${albumArtists.length > 1 ? "Artistas" : "Artista"} del Lanzamiento`}</Typography>
        </Grid>

        <Grid container item xs={12} spacing={2} sx={gridArtistViewsStyle}>
          {albumArtists.length > 0
            ? albumArtists.map((_, index) =>
              <ArtistInAddTrack
                key={index}
                index={index}
                // handleDelete={handleDeleteOtherArtist}
                // handleSliderChange={handleChangePrimaryOtherArtist}
                artists={albumArtists}
                allOtherArtists={[]}
                from={"album-info"} />)
            : []
          }
        </Grid>
      </Card>

    </Grid >
  );
}

export default AlbumTotalInfo;

const imageStyle = { width: "100%", height: "100%", borderRadius: "2em" };
const cardElementStyle = { borderRadius: "30px", width: "80em", height: "20em" };
const titleAlbumStlye = { color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap", margin: "0", fontWeight: 500 };
const artistTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };
const moreInfoTextStyle = { color: "rgba(0,0,0,0.4)", whiteSpace: "nowrap", margin: "0", fontWeight: 300, fontSize: "1em", marginBottom: "0" };
const selloTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };
const gridArtistViewsStyle = { margin: "0em 1em 1em 1em", height: "100%", };
const artistsTitleStyle = { fontSize: "1.5em", fontWeight: 500 };
const linkIconStyle = { textAlign: "inital", fontSize: "1rem", verticalAlign: "text-top", padding: 0 };
const buttonColorStyle = { backgroundColor: "#508062", '&:hover': { backgroundColor: "#508062" } };