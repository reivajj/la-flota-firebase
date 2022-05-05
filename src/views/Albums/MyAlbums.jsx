import React, { useState } from "react";
// core components
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import AlbumCard from "views/Albums/AlbumCard";
import useQuery from '../../customHooks/useQuery';
import { getFilteredAlbumsByUrl, getTitleLanzamientos } from '../../utils/albums.utils';
import { albumCleanUpdatingAlbum } from "redux/actions/AlbumsActions";
import { AddCircleOutline } from '@mui/icons-material/';
import NavigationBar from '../../components/Navbars/NavigationBar';
import SnackbarMui from 'components/Snackbar/SnackbarMui';

const MyAlbums = () => {

  const navigate = useNavigate();
  const params = useQuery();
  const dispatch = useDispatch()

  const albumsFromStore = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const labels = useSelector(store => store.labels.labels);
  const cantPages = Math.floor(albumsFromStore.length / 8);

  const [currentPage, setCurrentPage] = useState(0);
  const [openNoMoreWeeks, setOpenNoMoreWeeks] = useState(false);

  let filteredAlbumsIfNeeded = getFilteredAlbumsByUrl(params, albumsFromStore).filter(albumFiltered => albumFiltered.state !== "DELETED");
  const titleLanzamientos = getTitleLanzamientos(params, labels, artists);
  const noTienesLanzamientos = `No tienes ${titleLanzamientos}`;

  const myAlbumsProfiles = () => {
    return filteredAlbumsIfNeeded.length > 0
      ? filteredAlbumsIfNeeded.slice(currentPage * 8, (currentPage + 1) * 8).map((album, index) =>
        <Grid item xs={12} sm={6} lg={3} key={index} paddingBottom={2} sx={{ height: "600px" }}>
          <AlbumCard key={index} dataAlbum={album} index={index} />
        </Grid>
      )
      : []
  }

  let myAlbums = myAlbumsProfiles();

  const navigateToNewAlbum = () => {
    dispatch(albumCleanUpdatingAlbum());
    navigate("/admin/new-album");
  }

  const handleClickAfter = () => {
    if (currentPage < cantPages) { setCurrentPage(currentPage + 1); return; }
    setOpenNoMoreWeeks(true);
  }

  const handleClickBefore = () => {
    if (currentPage > 0) { setCurrentPage(currentPage - 1); return; }
    setOpenNoMoreWeeks(true);
  }

  const notiText = currentPage > 0 ? "No hay más lanzamientos." : "Es la primer página."

  return (
    <Grid container spacing={2} textAlign="center">
      <Grid item xs={12}>
        <Typography sx={albumsTitleStyles}>{titleLanzamientos}</Typography>
        <Button variant="contained" color="secondary" onClick={navigateToNewAlbum} endIcon={<AddCircleOutline />}>
          Nuevo Lanzamiento
        </Button>
      </Grid>

      {cantPages > 0 && <Grid container item spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={4} >
          <NavigationBar
            title="Navega entre los lanzamientos"
            handleClickAfter={handleClickAfter}
            handleClickBefore={handleClickBefore} />
        </Grid>
      </Grid>}

      <Grid container item>
        {
          myAlbums
        }
      </Grid>

      <Grid item xs={12}>
        {myAlbums.length === 0 &&
          <h4 style={noAlbumsTitleBlackStyles}>{noTienesLanzamientos}</h4>}
      </Grid>

      <SnackbarMui
        open={openNoMoreWeeks}
        setOpen={setOpenNoMoreWeeks}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        type={"info"}
        handleClose={() => setOpenNoMoreWeeks(false)}
        autoHide={3000}
        text={notiText} />
      );

    </Grid>
  );
}

export default MyAlbums;

const noAlbumsTitleBlackStyles = { color: "#000000", fontWeight: "300px", marginBottom: "3px" }
const albumsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }
