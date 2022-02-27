import React, { useEffect, useState } from "react";
import { Grid, Typography } from '@mui/material';
import TableWithHeader from "../../components/Table/TableWithHeader";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getArtistPropsForDataTable } from "utils/artists.utils";
import { toWithOutError } from 'utils';
import { getAlbumsPropsForAdminDataTable } from "utils/tables.utils";
import { usersGetOneByIdRedux } from "../../redux/actions/UsersActions";
import UserDialog from '../Users/UserDialog';
import { getEmailIfNotHaveUser } from '../../utils/users.utils';
import useFirestoreQuery from '../../customHooks/useFirestoreQuery';
import { getElementsAdminQueryFS } from "services/FirestoreServices";

const DashboardAdmin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const albums = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const currentUserData = useSelector(store => store.userData);
  const rol = currentUserData.rol;

  const [userSelected, setUserSelected] = useState(false);
  const [setStatusAlbumsSnapshot, statusAlbumsSnapshot] = useState("idle");
  const [setDataAlbumsSnapshot, dataAlbumsSnapshot] = useState("idle");
  
  const { data, status, error } = useFirestoreQuery(getElementsAdminQueryFS("albums", 3));

  if (status === "loading") return "Loading...";
  if (status === "error") return `Error: ${error.message}`;

  // useEffect(() => {
  //   if (status === "loading") return "Loading...";
  //   if (status === "error") return `Error: ${error.message}`;
  // }, [data, status, error])

  status === "success" && console.log("DATA OK : ", data);

  const handleCloseUserDialog = () => setUserSelected(false);

  const handleOpenUsuarioDialog = async userId => {
    const userData = await toWithOutError(dispatch(usersGetOneByIdRedux(userId)));
    setUserSelected(userData);
  }

  const handleGoToAlbum = albumId => navigate(`/admin/albums/${albumId}`);

  const albumsTableElements = getAlbumsPropsForAdminDataTable(albums, handleOpenUsuarioDialog, handleGoToAlbum) || [];
  const albumsTableHeaders = ["Lanzamiento", "Nombre Lanzamiento", "Artista Principal", "Estado", "Usuario", "UPC", "Formato", "Fecha de Lanzamiento"];
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

  return rol.indexOf('admin') >= 0
    ? (
      <Grid container spacing={8}>

        {/* <SuccessDialog isOpen={openBienvenidaAndCreateArtists} title="Bienvenid@s a la nueva sección de La Flota :)" contentTexts={bienvenidoDialogText}
        handleClose={handleCloseBienvenida} successImageSource="/images/success.jpg" size="sm" msgInGreen={messageFinishCreating} /> */}

        {userSelected && <UserDialog userData={userSelected} isOpen={Boolean(userSelected.id)} title={`${getEmailIfNotHaveUser(userSelected)}`}
          handleClose={handleCloseUserDialog} contentTexts={["Proximamente datos del usuario"]} />}

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "2.5em", fontWeigth: 500 }}>Has entrado al panel como usuario Admin</Typography>
        </Grid>

        <Grid container item spacing={8} sx={{ justifyContent: "center" }}>

          <Grid item xs={10}>
            <TableWithHeader {...propsToAlbumsTable} />
          </Grid>

          <Grid item xs={6}>
            <TableWithHeader {...propsToArtistsTable} />
          </Grid>

        </Grid>

      </Grid>
    ) : null;
}

export default DashboardAdmin;