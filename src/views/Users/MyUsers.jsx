import React, { useState, useEffect } from "react";
// core components
// import Button from "components/CustomButtons/Button.js";
import { Grid, Button, Typography, Backdrop, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoDialog from 'components/Dialogs/InfoDialog';
import { needAdminPermissionsText } from "utils/textToShow.utils";
import { userIsAdmin } from 'utils/users.utils';
import UserCard from './UserCard';
import NewUserDialog from "./NewUserDialog";
import SearchNavbar from '../../components/Navbars/SearchNavbar';
import { toWithOutError } from 'utils';
import { getSearchedUserRedux, getUsersByFieldRedux } from '../../redux/actions/UsersActions';
import { getAlbumsByFieldRedux } from "redux/actions/AlbumsActions";
import { userIsRRSS } from '../../utils/users.utils';

const MyUsers = () => {

  const dispatch = useDispatch();
  const usersFromStore = useSelector(store => store.users);
  const albumsFromStore = useSelector(store => store.albums.albums);
  const currentUser = useSelector(store => store.userData);

  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [openNewUserDialog, setOpenNewUserDialog] = useState({ open: false, action: "none", userId: 'new' });
  const [openLoaderMyUsers, setOpenLoaderMyUsers] = useState(false);
  const [openEmptySearch, setOpenEmptySearch] = useState(false);
  const [openErrorSearch, setOpenErrorSearch] = useState(false);

  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  const [searchAction, setSearchAction] = useState({ field: 'none', value: "" });
  const [usersFiltered, setUsersFiltered] = useState(usersFromStore);

  useEffect(() => {
    if (searchAction.value !== "") setUsersFiltered(usersFromStore.filter(user => user[`${searchAction.field}`] === searchAction.value));
    else setUsersFiltered(usersFromStore);
  }, [usersFromStore, searchAction]);

  const misUsuariosProfiles = users => {
    return users.length > 0
      ? users.map((user, index) =>
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <UserCard key={index} dataUser={user} index={index}
            isOpenEditDialog={openNewUserDialog} setOpenEditDialog={setOpenNewUserDialog}
            setOpenNotAdminWarning={setOpenNotAdminWarning} setOpenLoaderMyUsers={setOpenLoaderMyUsers}
            setOpenEmptySearch={setOpenEmptySearch} setOpenErrorSearch={setOpenErrorSearch} />
        </Grid>
      )
      : []
  }

  let misUsuarios = misUsuariosProfiles(usersFiltered);
  let defaultUserData = { email: "", password: "", plan: "charly-garcia", userStatus: "ACTIVA" }

  const agregarUsuario = () => {
    if (!userIsAdmin(currentUser.rol)) setOpenNotAdminWarning(true);
    else setOpenNewUserDialog({ open: true, action: 'add', userId: 'new' });
  }

  const cleanSearchResults = () => {
    setSearchAction({ field: 'none', value: "" });
    setEmailSearchValue("");
    setUpcSearchValue("");
  }

  const onSearchEmailHandler = async email => {
    setOpenLoaderMyUsers(true);
    let checkIfExistsInStore = usersFromStore.find(userFromStore => userFromStore.email === email);
    if (!checkIfExistsInStore) {
      let userResult = await toWithOutError(dispatch(getSearchedUserRedux(email)));
      if (userResult === "ERROR") { setOpenLoaderMyUsers(false); setOpenErrorSearch(true); return "ERROR"; }
    }
    setSearchAction({ field: 'email', value: email });
    setOpenLoaderMyUsers(false);
  }

  const onSearchUPCHandler = async upc => {
    setOpenLoaderMyUsers(true);
    let albumFromUPC = albumsFromStore.find(albumFromStore => albumFromStore.upc === upc);
    if (!albumFromUPC) {
      albumFromUPC = await toWithOutError(dispatch(getAlbumsByFieldRedux('upc', upc)));
      if (albumFromUPC === "ERROR") { setOpenLoaderMyUsers(false); setOpenErrorSearch(true); return "ERROR"; }
      if (albumFromUPC === "EMPTY") { setOpenLoaderMyUsers(false); setOpenEmptySearch(true); return "EMPTY"; }
    }

    albumFromUPC = Array.isArray(albumFromUPC) ? albumFromUPC[0] : albumFromUPC;
    let gettingUsersResults = await toWithOutError(dispatch(getUsersByFieldRedux('id', albumFromUPC.ownerId, 1)));
    if (gettingUsersResults === "ERROR") { setOpenLoaderMyUsers(false); setOpenErrorSearch(true); return "ERROR"; }
    setSearchAction({ field: 'id', value: albumFromUPC.ownerId });
    setOpenLoaderMyUsers(false);
  }

  const handleEnterKeyPress = (event, searchProps) => {
    if (event.key === 'Enter') {
      if (searchProps.name === "Email") onSearchEmailHandler(searchProps.value);
      if (searchProps.name === "UPC") onSearchUPCHandler(searchProps.value);
    }
  }

  const emailSearchProps = { name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailSearchValue.trim(), setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC", handleEnterKeyPress, onSearchHandler: onSearchUPCHandler, value: upcSearchValue.trim(), setValue: setUpcSearchValue };

  return userIsAdmin(currentUser.rol) && !userIsRRSS(currentUser.rol)
    ? (
      <Grid container spacing={2} sx={{ textAlign: "center" }}>

        <Backdrop open={openLoaderMyUsers}>
          <CircularProgress />
        </Backdrop>

        <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
          title={"Necesitas permisos de Administrador"} contentTexts={needAdminPermissionsText} />

        <InfoDialog isOpen={openEmptySearch} handleClose={() => setOpenEmptySearch(false)}
          title={"La búsqueda no arrojó resultados"} contentTexts={[]} />

        <InfoDialog isOpen={openErrorSearch} handleClose={() => setOpenErrorSearch(false)}
          title={"Hubo un error al realizar la búsqueda."} contentTexts={["Por favor, intente nuevamente."]} />

        <NewUserDialog isOpen={openNewUserDialog} handleCloseDialog={() => setOpenNewUserDialog({ open: false, action: "none", userId: 'new' })}
          userSelected={defaultUserData} />

        <Grid item xs={12}>
          <Typography sx={artistsTitleStyles}>Usuarios</Typography>

          <Grid item xs={12} padding={2} >
            <SearchNavbar searchArrayProps={[emailSearchProps, upcSearchProps]} cleanSearchResults={cleanSearchResults} />
          </Grid>

          <Button variant="contained" color="secondary" onClick={agregarUsuario} endIcon={<PersonAddIcon />}>
            Agregar Usuario
          </Button>

        </Grid>
        <Grid container item >
          {
            misUsuarios
          }
        </Grid>
        <Grid item xs={12}>
          {misUsuarios.length === 0 &&
            <h4 style={cardTitleBlack}>{searchAction.field !== 'none' ? "La búsqueda no arrojo resultados" : "No tienes Usuarios"}</h4>}
        </Grid>
      </Grid>
    ) : <p>No tienes los permisos suficientes para ver ésta página</p>;
}

export default MyUsers;

const cardTitleBlack = {
  color: "#000000",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
};

const artistsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }