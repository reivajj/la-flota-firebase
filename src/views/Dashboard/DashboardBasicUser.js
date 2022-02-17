import React, { useEffect, useState } from "react";
import { Grid, Typography } from '@mui/material';
import TableWithHeader from "../../components/Table/TableWithHeader";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAlbumsPropsForDataTable } from "utils/albums.utils";
import { getArtistPropsForDataTable } from "utils/artists.utils";
import { artistsCreateFromDGArtistsRedux } from '../../redux/actions/ArtistsActions';
import { toWithOutError } from 'utils';
import { userDataUpdateRedux } from '../../redux/actions/UserDataActions';
import SuccessDialog from '../../components/Dialogs/SuccessDialog';
import { bienvenidoDialogText } from '../../utils/textToShow.utils';

const DashboardBasicUser = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const albums = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const currentUserData = useSelector(store => store.userData);

  const [openBienvenidaAndCreateArtists, setOpenBienvenidaAndCreateArtists] = useState(false);
  const [messageFinishCreating, setMessageFinishCreating] = useState("");

  const handleCloseBienvenida = () => {
    setOpenBienvenidaAndCreateArtists(false);
  }

  useEffect(() => {
    if (!openBienvenidaAndCreateArtists && currentUserData.isNewInFBSystem) {

      const createDgArtists = async () => {
        let result = await toWithOutError(dispatch(artistsCreateFromDGArtistsRedux(currentUserData.id, currentUserData.email)));
        if (result === "ERROR") return "ERROR";

        let [errorUpdatingUser] = await toWithOutError(dispatch(userDataUpdateRedux({ isNewInFBSystem: false, id: currentUserData.id })));
        if (errorUpdatingUser === "ERROR") return "ERROR";
        setMessageFinishCreating("Artistas enlazados");
      }

      setOpenBienvenidaAndCreateArtists(currentUserData.isNewInFBSystem);
      createDgArtists();
    }
  }, [currentUserData.isNewInFBSystem])

  const albumsTableElements = getAlbumsPropsForDataTable(albums) || [];
  const albumsTableHeaders = ["Nombre", "Artista Principal", "UPC", "Formato", "Fecha de Lanzamiento"];
  const handleGoToAlbums = () => navigate("/admin/albums");
  const propsToAlbumsTable = {
    titleTable: "Lanzamientos", tableElements: albumsTableElements, tableHeaders: albumsTableHeaders,
    buttonText: `${albums.length > 5 ? "Ver Más" : "Ir a Lanzamientos"}`, handleButtonClick: handleGoToAlbums, backgroundColor: "lavender", tableWidth: "100%",
  }

  const artistsTableElements = getArtistPropsForDataTable(artists) || [];
  const artistsTableHeaders = ["Nombre", "Spotify Uri", "Apple ID"];
  const handleGoToArtists = () => navigate("/admin/artists");
  const propsToArtistsTable = {
    titleTable: "Artistas", tableElements: artistsTableElements, tableHeaders: artistsTableHeaders,
    buttonText: `${artists.length > 5 ? "Ver Más" : "Ir a Artistas"}`, handleButtonClick: handleGoToArtists, backgroundColor: "thistle"
  }

  return (
    <Grid container spacing={8}>

      <SuccessDialog isOpen={openBienvenidaAndCreateArtists} title="Bienvenid@s a la nueva sección de La Flota :)" contentTexts={bienvenidoDialogText}
        handleClose={handleCloseBienvenida} successImageSource="/images/success.jpg" size="sm" msgInGreen={messageFinishCreating} />

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography sx={{ fontSize: "2.5em", fontWeigth: 500 }}>Te damos la bienvenida al nuevo panel de distribución digital ♫</Typography>
        {/* <Typography sx={{ fontSize: "2em", fontWeigth: "400" }}>Bienvenid♫s a La Flota</Typography> */}
      </Grid>

      <Grid container item spacing={8}>

        <Grid item xs={6}>
          <TableWithHeader {...propsToArtistsTable} />
        </Grid>
        
        <Grid item xs={6}>
          <TableWithHeader {...propsToAlbumsTable} />
        </Grid>

      </Grid>


    </Grid>
  );
}

export default DashboardBasicUser;