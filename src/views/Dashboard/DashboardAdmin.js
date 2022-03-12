import React, { useEffect, useState } from "react";
import { Grid, Typography, Button } from '@mui/material';
import TableWithHeader from "../../components/Table/TableWithHeader";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getArtistPropsForDataTable } from "utils/artists.utils";
import { toWithOutError } from 'utils';
import { getAlbumsPropsForAdminDataTable } from "utils/tables.utils";
import { usersGetOneByIdRedux } from "../../redux/actions/UsersActions";
import UserDialog from '../Users/UserDialog';
import { getEmailIfNotHaveUser, getUsersPropsForDataTable, sortUsersByField } from '../../utils/users.utils';
import useFirestoreQuery from '../../customHooks/useFirestoreQuery';
import { getElementsAdminQueryFS } from "services/FirestoreServices";
import { sortAlbumsByField } from '../../utils/albums.utils';
import { albumsAddStore } from "redux/actions/AlbumsActions";
import { userIsAdmin } from 'utils/users.utils';
import { sortArtistsByField } from '../../utils/artists.utils';
import { artistsAddStore } from '../../redux/actions/ArtistsActions';
import SearchNavbar from '../../components/Navbars/SearchNavbar';

const DashboardAdmin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const albums = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const currentUserData = useSelector(store => store.userData);
  const users = useSelector(store => store.users);
  const rol = currentUserData.rol;

  let sortedAlbums = sortAlbumsByField(albums, "lastUpdateTS");
  let sortedArtists = sortArtistsByField(artists, "lastUpdateTS");
  let sortedUsers = sortUsersByField(users, "lastUpdateTS");

  const [userSelected, setUserSelected] = useState(false);
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  // const [setStatusAlbumsSnapshot, statusAlbumsSnapshot] = useState("idle");
  // const [setDataAlbumsSnapshot, dataAlbumsSnapshot] = useState("idle");

  const stateAlbumSnap = useFirestoreQuery(getElementsAdminQueryFS("albums", 20, sortedAlbums[0]?.lastUpdateTS || 0));
  const stateArtistsSnap = useFirestoreQuery(getElementsAdminQueryFS("artists", 20, sortedArtists[0]?.lastUpdateTS || 0));

  useEffect(() => {
    if (stateArtistsSnap.status === "loading") return "Loading...";
    if (stateArtistsSnap.status === "error") return `Error al cargar los ultimos Artistas: ${stateArtistsSnap.error.message}`;
    if (stateArtistsSnap.status === "success" && stateArtistsSnap.data.length > 0) dispatch(artistsAddStore(stateArtistsSnap.data));
  }, [stateArtistsSnap])

  useEffect(() => {
    if (stateAlbumSnap.status === "loading") return "Loading...";
    if (stateAlbumSnap.status === "error") return `Error al cargar los ultimos Albums: ${stateAlbumSnap.error.message}`;
    if (stateAlbumSnap.status === "success" && stateAlbumSnap.data.length > 0) dispatch(albumsAddStore(stateAlbumSnap.data));
  }, [stateAlbumSnap])

  const handleCloseUserDialog = () => setUserSelected(false);

  const handleOpenUsuarioDialog = async userId => {
    const userData = await toWithOutError(dispatch(usersGetOneByIdRedux(userId)));
    setUserSelected(userData);
  }

  const handleGoToAlbum = albumId => navigate(`/admin/albums/${albumId}`);

  const albumsTableElements = getAlbumsPropsForAdminDataTable(sortedAlbums, handleOpenUsuarioDialog, handleGoToAlbum) || [];
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
    buttonText: `${sortedArtists.length > 5 ? "Ver Más" : "Ir a Artistas"}`, handleButtonClick: handleGoToArtists, backgroundColor: "thistle", tableWidth: "90%",
  }

  const usersTableElements = getUsersPropsForDataTable(users) || [];
  const usersTableHeaders = userIsAdmin(rol) ? ["Email", "Password", "Nombre", "Plan", "WP Id"] : ["Email", "Nombre"];
  const handleGoToUsers = () => navigate("/admin/users");
  const propsToUsersTable = {
    titleTable: "Usuarios", tableElements: usersTableElements, tableHeaders: usersTableHeaders,
    buttonText: `${sortedUsers.length > 5 ? "Ver Más" : "Ir a Usuarios"}`, handleButtonClick: handleGoToUsers, backgroundColor: "lavender", tableWidth: "100%",
  }

  const onSearchEmailHandler = email => {
    console.log("SEARCHING BY EMAIL: ", email);
  }

  const onSearchUPCHandler = upc => {
    console.log("SEARCHING BY UPC: ", upc);
  }

  const emailSearchProps = { name: "Email", onSearchHandler: onSearchEmailHandler, value: emailSearchValue, setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC", onSearchHandler: onSearchUPCHandler, value: upcSearchValue, setValue: setUpcSearchValue};

  return rol.indexOf('admin') >= 0
    ? (
      <Grid container spacing={8}>

        {userSelected && <UserDialog userData={userSelected} isOpen={Boolean(userSelected.id)} title={`${getEmailIfNotHaveUser(userSelected)}`}
          handleClose={handleCloseUserDialog} contentTexts={["Proximamente datos del usuario"]} />}

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "2.5em", fontWeigth: 500 }}>Has entrado al panel como usuario Admin</Typography>
        </Grid>

        <Grid container item spacing={8} sx={{ justifyContent: "center" }}>

          <Grid item xs={10}>
            <SearchNavbar searchArrayProps={[emailSearchProps, upcSearchProps]} />
          </Grid>

          <Grid item xs={10}>
            <TableWithHeader {...propsToAlbumsTable} />
          </Grid>

          <Grid item xs={8}>
            <TableWithHeader {...propsToArtistsTable} />
          </Grid>

          <Grid item xs={10}>
            <TableWithHeader {...propsToUsersTable} />
          </Grid>

        </Grid>

      </Grid>
    ) : null;
}

export default DashboardAdmin;