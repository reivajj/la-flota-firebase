import React from "react";
import { Image } from 'mui-image';
import { useNavigate, useParams } from 'react-router-dom';
// core components
import { Grid, Typography, Card, Link, ButtonBase } from '@mui/material';
// import { deleteAlbumDialogText } from "utils/textToShow.utils";
// import { deleteAlbumRedux } from "redux/actions/AlbumsActions";
import { useSelector } from 'react-redux';
import { getAlbumById, getArtistNameAndPrimaryOfAlbum, getStateColor, getOurStateFromFugaState } from "utils/albums.utils";
import { targetUrl } from "services/BackendCommunication";
import { useFetch } from '../../customHooks/useAxios';
import { getLocalDateString } from '../../utils/timeRelated.utils';
import TracksTableInAlbumInfo from '../../components/Table/TracksTableInAlbumInfo';
import ArtistInAddTrack from '../Artists/ArtistInAddTrack';
// import { NewTrackDialog } from 'views/Tracks/NewTrackDialog';
// import { getTracksFieldsFromFugaTrack } from "utils/tracks.utils";
// import { getOurStateFromFugaState } from '../../utils/albums.utils';
import { getTracksDataTableFromFugaAssets } from '../../utils/tables.utils';

const AlbumTotalInfo = () => {

  const navigate = useNavigate();
  const params = useParams();

  const albums = useSelector(store => store.albums.albums);

  const dataAlbum = getAlbumById(albums, params.albumId);

  const url = dataAlbum.fugaId && `${targetUrl}albums/${dataAlbum.fugaId}`;

  const { status, data, error } = useFetch(url);

  const stateInfoStyle = { color: getStateColor(data.state ? data.state : ""), fontSize: "1em", fontWeight: 400 };

  console.log("data album: ", dataAlbum);
  status === "fetched" && console.log("data albumFuga: ", data);

  // const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);
  // const [trackData, setTrackData] = useState({});

  // const handleEditTrack = trackFuga => {
  //   setTrackData(getTracksFieldsFromFugaTrack(trackFuga));
  //   setOpenNewTrackDialog(true);
  // }

  // const handleDeleteTrack = () => {
  //   console.log("Handle delete track");
  // }

  const tracksDataTable = status === "fetched" ? getTracksDataTableFromFugaAssets(data.assets) : [];
  const albumArtists = getArtistNameAndPrimaryOfAlbum(dataAlbum);
  // const handleEditAlbum = () => navigate(`/admin/edit-album/${dataAlbum.id}`);
  // const goToAlbumInfo = () => console.log("ALBUM INFO: ", dataAlbum);
  // const goToLabelAlbum = () => navigate(`/admin/labels?view=label&label_name=${dataAlbum.label_name}`);
  // const goToPrincipalArtist = () => navigate(`/admin/artists?view=artist&id=${dataAlbum.artistId}`);

  // const linkToSello = <Link component="button" underline="hover" sx={linkToLabelStyles} onClick={goToLabelAlbum}  >
  //   {dataAlbum.label_name}
  // </Link>

  return (
    <Grid container justifyContent="center">

      <Card sx={cardElementStyle}>

        <Grid container spacing={2} >

          <Grid item>
            <ButtonBase sx={{ width: "20em", height: "20em" }}>
              {dataAlbum.imagenUrl && <Image
                style={imageStyle}
                alt="album-image"
                duration={30}
                src={dataAlbum.imagenUrl}
              />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} sm container>

            <Grid item xs container direction="column" spacing={1}>
              <Grid item xs>

                <Typography gutterBottom sx={titleAlbumStlye}>
                  {dataAlbum.title}
                </Typography>

                <Typography variant="body2" gutterBottom sx={artistTextStyle}>
                  {`Artistas: ${status === 'fetched' ? data.display_artist : ""}`}
                </Typography>

                <Grid item xs={12} >
                  <Typography ><b style={selloTextStyle}>Sello: </b>{`${status === 'fetched' ? data.label.name : ""}`}</Typography>
                </Grid>

                <Grid item xs={12} sx={{ paddingTop: "1em" }}>
                  <Typography sx={moreInfoTextStyle}>
                    {`UPC: ${status === "fetched" ? data.upc : ""}`}
                  </Typography>
                </Grid>

                <Grid item xs container sx={{ paddingTop: "1em" }}>
                  <Grid item xs={12}>
                    <Typography sx={moreInfoTextStyle}>
                      {`FECHA DE CREACIÓN: ${status === "fetched" ? getLocalDateString(data.created_date) : ""}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={moreInfoTextStyle}>
                      {`FECHA DE LANZAMIENTO: ${status === "fetched" ? getLocalDateString(data.original_release_date) : ""}`}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ paddingTop: "0.5em" }}>
                  <Typography sx={stateInfoStyle}>
                    {`ESTADO: ${status === "fetched" ? getOurStateFromFugaState(data.state) : ""}`}
                  </Typography>
                </Grid>

              </Grid>

            </Grid>

          </Grid>
        </Grid>

        <TracksTableInAlbumInfo tracksTableData={tracksDataTable} handleClickAddTrack={() => console.log("Add track")} />

        {/* {openNewTrackDialog && <Grid item xs={12}>
          <NewTrackDialog openDialog={openNewTrackDialog} setOpenNewTrackDialog={setOpenNewTrackDialog} trackData={trackData} />
        </Grid>} */}

      </Card >

      <Card sx={cardElementStyle}>

        <Grid item xs={12} padding="1em 1em 0em">
          <Typography sx={artistsTitleStyle}>Artistas del Album</Typography>
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

const imageStyle = { width: "20em", height: "20em", borderRadius: "2em" };
const cardElementStyle = { borderRadius: "30px", marginTop: "20px", width: "80em", height: "100%" };
const linkToLabelStyles = { fontSize: "1em", verticalAlign: "baseline" }
const titleAlbumStlye = { color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap", margin: "0", fontWeight: 500, fontSize: "2.5em", marginTop: "0.5em" };
const artistTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };
const moreInfoTextStyle = { color: "rgba(0,0,0,0.4)", whiteSpace: "nowrap", margin: "0", fontWeight: 300, fontSize: "1em", marginBottom: "0" };
const selloTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };
const gridArtistViewsStyle = { margin: "0em 1em 1em 1em", height: "100%", };
const artistsTitleStyle = { fontSize: "1.5em", fontWeight: 500 };