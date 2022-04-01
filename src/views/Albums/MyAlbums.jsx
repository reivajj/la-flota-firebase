import React from "react";
// core components
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import AlbumCard from "views/Albums/AlbumCard";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useQuery from '../../customHooks/useQuery';
import { getFilteredAlbumsByUrl, getTitleLanzamientos } from '../../utils/albums.utils';
import { albumCleanUpdatingAlbum } from "redux/actions/AlbumsActions";

const MyAlbums = () => {

  const navigate = useNavigate();
  const params = useQuery();
  const dispatch = useDispatch()

  const albumsFromStore = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const labels = useSelector(store => store.labels.labels);

  let filteredAlbumsIfNeeded = getFilteredAlbumsByUrl(params, albumsFromStore).filter(albumFiltered => albumFiltered.state !== "DELETED");
  const titleLanzamientos = getTitleLanzamientos(params, labels, artists);
  const noTienesLanzamientos = `No tienes ${titleLanzamientos}`;

  const myAlbumsProfiles = () => {
    return filteredAlbumsIfNeeded.length > 0
      ? filteredAlbumsIfNeeded.map((album, index) =>
        <Grid item xs={12} sm={6} lg={3} key={index} paddingBottom={2}>
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

  return (
    <Grid container spacing={2} textAlign="center">
      <Grid item xs={12}>
        <Typography sx={albumsTitleStyles}>{titleLanzamientos}</Typography>
        <Button variant="contained" color="secondary" onClick={navigateToNewAlbum} endIcon={<AddCircleOutlineIcon />}>
          Nuevo Lanzamiento
        </Button>
      </Grid>

      <Grid container item>
        {
          myAlbums
        }
      </Grid>

      <Grid item xs={12}>
        {myAlbums.length === 0 &&
          <h4 style={noAlbumsTitleBlackStyles}>{noTienesLanzamientos}</h4>}
      </Grid>
    </Grid>
  );
}

export default MyAlbums;

const noAlbumsTitleBlackStyles = { color: "#000000", fontWeight: "300px", marginBottom: "3px" }
const albumsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }
