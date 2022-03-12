import React, { useState, useEffect } from "react";
// core components
// import Button from "components/CustomButtons/Button.js";
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoDialog from 'components/Dialogs/InfoDialog';
import { needAdminPermissionsText } from "utils/textToShow.utils";
import { userIsAdmin } from 'utils/users.utils';
import UserCard from './UserCard';
import NewUserDialog from "./NewUserDialog";
import SearchNavbar from '../../components/Navbars/SearchNavbar';
import { getUserDataByEmailInFS } from '../../services/FirestoreServices';
import { toWithOutError } from 'utils';
import { getSearchedUserRedux } from '../../redux/actions/UsersActions';

const MyUsers = () => {

  const dispatch = useDispatch();
  const usersFromStore = useSelector(store => store.users);
  const currentUser = useSelector(store => store.userData);

  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [openNewUserDialog, setOpenNewUserDialog] = useState({ open: false, action: "none", userId: 'new' });

  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  const [searchAction, setSearchAction] = useState({ field: 'none', value: "" });
  const [usersFiltered, setUsersFiltered] = useState(usersFromStore);

  useEffect(() => {
    if (searchAction.value !== "") {
      console.log("SEARCH ACTION IN IF: ", searchAction);
      setUsersFiltered(usersFromStore.filter(user => user[`${searchAction.field}`] === searchAction.value))
    }
    else setUsersFiltered(usersFromStore);
  }, [usersFromStore, searchAction]);

  const misUsuariosProfiles = users => {
    return users.length > 0
      ? users.map((user, index) =>
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <UserCard key={index} dataUser={user} index={index}
            isOpenEditDialog={openNewUserDialog} setOpenEditDialog={setOpenNewUserDialog}
            setOpenNotAdminWarning={setOpenNotAdminWarning} />
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
    console.log("SEARCHING BY EMAIL: ", email);
    let checkIfExistsInStore = usersFromStore.find(userFromStore => userFromStore.email === email);
    if (checkIfExistsInStore?.email === email) {
      setSearchAction({ field: 'email', value: email });
      return;
    }

    let userResult = await toWithOutError(dispatch(getSearchedUserRedux(email)));
    console.log("RESULT: ", userResult);
    setSearchAction({ field: 'email', value: email });
  }

  const onSearchUPCHandler = upc => {
    console.log("SEARCHING BY UPC: ", upc);
  }

  const emailSearchProps = { name: "Email", onSearchHandler: onSearchEmailHandler, value: emailSearchValue, setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC", onSearchHandler: onSearchUPCHandler, value: upcSearchValue, setValue: setUpcSearchValue };

  return (
    <Grid container spacing={2} sx={{ textAlign: "center" }}>

      <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
        title={"Necesitas permisos de Administrador"} contentTexts={needAdminPermissionsText} />

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
  );
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