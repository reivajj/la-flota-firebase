import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, CircularProgress, Backdrop } from '@mui/material';
import TableWithHeader from "../../components/Table/TableWithHeader";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getArtistPropsForDataTable } from "utils/artists.utils";
import { toWithOutError } from 'utils';
import { getAlbumsPropsForAdminDataTable } from "utils/tables.utils";
import { getSearchedUserRedux, getUserIdByUPCRedux, getUsersByFieldRedux, usersGetOneByIdRedux } from "../../redux/actions/UsersActions";
import UserDialog from '../Users/UserDialog';
import { getEmailIfNotHaveUser, getUsersPropsForDataTable, sortUsersByField } from '../../utils/users.utils';
import useFirestoreQuery from '../../customHooks/useFirestoreQuery';
import { getElementsAdminQueryFS } from "services/FirestoreServices";
import { sortAlbumsByField } from '../../utils/albums.utils';
import { albumsAddStore, getAlbumsByFieldRedux, getAlbumByUPCRedux } from "redux/actions/AlbumsActions";
import { userIsAdmin } from 'utils/users.utils';
import { sortArtistsByField } from '../../utils/artists.utils';
import { artistsAddStore, getArtistByFieldRedux } from '../../redux/actions/ArtistsActions';
import SearchNavbar from '../../components/Navbars/SearchNavbar';
import InfoDialog from '../../components/Dialogs/InfoDialog';

const DashboardAdmin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const albums = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const currentUserData = useSelector(store => store.userData);
  const users = useSelector(store => store.users);
  const rol = currentUserData.rol;

  // COSAS DEL BUSCADOR
  const [openLoaderDashboard, setOpenLoaderDashboard] = useState(false);
  const [openEmptySearch, setOpenEmptySearch] = useState(false);
  const [openErrorSearch, setOpenErrorSearch] = useState(false);

  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  const [searchAction, setSearchAction] = useState({ field: 'none', value: "" });
  const [usersFiltered, setUsersFiltered] = useState(users);
  const [artistsFiltered, setArtistsFiltered] = useState(artists);
  const [albumsFiltered, setAlbumsFiltered] = useState(albums);

  useEffect(() => {
    if (searchAction.recently) {
      setUsersFiltered(users.filter(user => user[`${searchAction.user.field}`] === searchAction.user.value))
      setArtistsFiltered(artists.filter(artist => artist[`${searchAction.artist.field}`] === searchAction.artist.value))
      setAlbumsFiltered(albums.filter(album => album[`${searchAction.album.field}`] === searchAction.album.value))
    }
    else {
      setUsersFiltered(users);
      setArtistsFiltered(artists);
      setAlbumsFiltered(albums);
    }
  }, [users, albums, artists, searchAction]);

  let sortedAlbums = sortAlbumsByField(albumsFiltered, "lastUpdateTS");
  let sortedArtists = sortArtistsByField(artistsFiltered, "lastUpdateTS");
  let sortedUsers = sortUsersByField(usersFiltered, "lastUpdateTS");

  const [userSelected, setUserSelected] = useState(false);

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

  const artistsTableElements = getArtistPropsForDataTable(sortedArtists) || [];
  const artistsTableHeaders = ["Nombre", "Spotify Uri", "Apple ID"];
  const handleGoToArtists = () => navigate("/admin/artists");
  const propsToArtistsTable = {
    titleTable: "Artistas", tableElements: artistsTableElements, tableHeaders: artistsTableHeaders,
    buttonText: `${sortedArtists.length > 5 ? "Ver Más" : "Ir a Artistas"}`, handleButtonClick: handleGoToArtists, backgroundColor: "thistle", tableWidth: "90%",
  }

  const usersTableElements = getUsersPropsForDataTable(sortedUsers) || [];
  const usersTableHeaders = userIsAdmin(rol) ? ["Email", "Password", "Nombre", "Plan", "WP Id"] : ["Email", "Nombre"];
  const handleGoToUsers = () => navigate("/admin/users");
  const propsToUsersTable = {
    titleTable: "Usuarios", tableElements: usersTableElements, tableHeaders: usersTableHeaders,
    buttonText: `${sortedUsers.length > 5 ? "Ver Más" : "Ir a Usuarios"}`, handleButtonClick: handleGoToUsers, backgroundColor: "lavender", tableWidth: "100%",
  }

  const cleanSearchResults = () => {
    setSearchAction({ user: { field: 'none', value: "" }, artist: { field: 'none', value: "" }, album: { field: 'none', value: "" }, recently: false });
    setEmailSearchValue("");
    setUpcSearchValue("");
  }

  const onSearchEmailHandler = async email => {
    setOpenLoaderDashboard(true);
    let userFinded = users.find(userFromStore => userFromStore.email === email);
    if (!userFinded) {
      userFinded = await toWithOutError(dispatch(getSearchedUserRedux(email)));
      if (userFinded === "ERROR") { setOpenLoaderDashboard(false); setOpenErrorSearch(true); return "ERROR"; }
    }

    await toWithOutError(dispatch(getArtistByFieldRedux('ownerId', userFinded.id)));
    await toWithOutError(dispatch(getAlbumsByFieldRedux('ownerId', userFinded.id)));
    setSearchAction({
      user: { field: 'email', value: email }, artist: { field: 'ownerId', value: userFinded.id },
      album: { field: 'ownerId', value: userFinded.id }, recently: true
    });
    setOpenLoaderDashboard(false);
  }

  const onSearchUPCHandler = async upc => {
    setOpenLoaderDashboard(true);
    let albumFinded = albums.find(albumFromStore => albumFromStore.upc === upc);
    if (!albumFinded) {
      [albumFinded] = await toWithOutError(dispatch(getAlbumsByFieldRedux('upc', upc)));
      if (albumFinded === "ERROR") { setOpenLoaderDashboard(false); setOpenErrorSearch(true); return "ERROR"; }
    }
    console.log("ALBUM FINDED: ", albumFinded);
    await toWithOutError(dispatch(getArtistByFieldRedux('ownerId', albumFinded.ownerId)));
    await toWithOutError(dispatch(getUsersByFieldRedux('id', albumFinded.ownerId, 1)));
    setSearchAction({
      user: { field: 'id', value: albumFinded.ownerId }, artist: { field: 'id', value: albumFinded.artistId },
      album: { field: 'upc', value: upc }, recently: true
    });
    setOpenLoaderDashboard(false);
  }

  const emailSearchProps = { name: "Email", onSearchHandler: onSearchEmailHandler, value: emailSearchValue, setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC", onSearchHandler: onSearchUPCHandler, value: upcSearchValue, setValue: setUpcSearchValue };

  return userIsAdmin(rol)
    ? (
      <Grid container spacing={8}>

        <Backdrop open={openLoaderDashboard}>
          <CircularProgress />
        </Backdrop>

        {userSelected && <UserDialog userData={userSelected} isOpen={Boolean(userSelected.id)} title={`${getEmailIfNotHaveUser(userSelected)}`}
          handleClose={handleCloseUserDialog} contentTexts={["Proximamente datos del usuario"]} />}

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "2.5em", fontWeigth: 500 }}>Has entrado al panel como usuario Admin</Typography>
        </Grid>

        <Grid container item spacing={8} sx={{ justifyContent: "center" }}>

          <InfoDialog isOpen={openEmptySearch} handleClose={() => setOpenEmptySearch(false)}
            title={"La búsqueda no arrojó resultados"} contentTexts={[]} />

          <InfoDialog isOpen={openErrorSearch} handleClose={() => setOpenErrorSearch(false)}
            title={"Hubo un error al realizar la búsqueda."} contentTexts={["Por favor, intente nuevamente."]} />

          <Grid item xs={10}>
            <SearchNavbar searchArrayProps={[emailSearchProps, upcSearchProps]} cleanSearchResults={cleanSearchResults} />
          </Grid>

          {!openLoaderDashboard &&
            <>
              <Grid item xs={10}>
                <TableWithHeader {...propsToAlbumsTable} />
              </Grid>

              <Grid item xs={8}>
                <TableWithHeader {...propsToArtistsTable} />
              </Grid>

              <Grid item xs={10}>
                <TableWithHeader {...propsToUsersTable} />
              </Grid>
            </>
          }

        </Grid>

      </Grid>
    ) : <p>No tienes los permisos suficientes para ver ésta página</p>;
}

export default DashboardAdmin;