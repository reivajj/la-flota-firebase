import React, { useRef, useState, useEffect } from "react";
import useForm from '../../customHooks/useForm';
import {
  Grid, Typography, Button, TextField, Box, MenuItem,
  FormControl, Select, Chip, InputLabel, OutlinedInput
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Save, LockOpen } from '@mui/icons-material';
import SimpleReactValidator from 'simple-react-validator';
import { unstable_createMuiStrictModeTheme as createTheme } from '@mui/material';
import ReauthenticateDialog from "../../components/Dialogs/ReauthenticateDialog";
import { provincias, generosMusicalesList } from '../../services/DatosVarios';
import useForceUpdate from 'components/Varios/ForceUpdate.js';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { errorFormat, to } from 'utils';
import { editPerfil } from "redux/actions/UserDataActions";
import ProgressButton from 'components/CustomButtons/ProgressButton';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const theme = createTheme();

theme.typography.h6 = {
  fontSize: '0.5rem',
  '@media (min-width:600px)': {
    fontSize: '0.6rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.8rem',
  },
};
const getStyles = (generoMusical) => {
  return {
    fontWeight:
      generosMusicalesList.indexOf(generoMusical) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const UserProfile = () => {

  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();

  const userData = useSelector(store => store.userData);
  const errorHandler = useSelector(store => store.errorHandler);

  const [openChangeCredentialsDialog, setOpenChangeCredentialsDialog] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  let provinciaDelUsuarioActual = userData.provincia ? provincias.filter(provincia => provincia.value === userData.provincia)[0].value : "";

  let defaultData = {
    nombre: userData.nombre || "",
    apellido: userData.apellido || "",
    provincia: provinciaDelUsuarioActual,
    telefono: userData.telefono || "",
    ciudad: userData.ciudad || "",
    email: userData.email,
    stats: userData.stats,
    imagenUrl: userData.imagenUrl || "",
    id: userData.id,
  };

  const handleSubmit = async () => {
    if (checkFields()) {
      setOpenLoader(true);
      let [error, resultEdit] = await to(dispatch(editPerfil({ ...formData, generosMusicales })));
      console.log("RESULT:", resultEdit);
      setEditState(resultEdit);
      setOpenLoader(false);
    }
  }

  const checkFields = () => {
    forceUpdate();
    if (simpleValidator.current.allValid()) return true;
    else {
      console.log(simpleValidator.current);
      simpleValidator.current.showMessages();
      forceUpdate();
      return false;
    }
  }

  const [formData, setForm] = useForm(defaultData);

  const handleAddGeneroMusical = (event) => {
    setGenerosMusicales(event.target.value);
  }

  const handleOpenChangeCredentials = () => {
    setOpenChangeCredentialsDialog(true);
  }

  let { email, nombre, apellido, ciudad, provincia, telefono } = formData;

  const [generosMusicales, setGenerosMusicales] = useState(userData.generosMusicales || []);
  const [editState, setEditState] = useState("none");
  const [buttonText, setButtonText] = useState("Actualizar Datos");

  useEffect(() => {
    if (editState === "success") setButtonText("Datos Actualizados");
  }, [editState, errorHandler]);

  return (
    <Grid container justifyContent="center">

      <ReauthenticateDialog isOpen={openChangeCredentialsDialog} setIsOpen={setOpenChangeCredentialsDialog}
        textName={userData.nombre} />

      <Grid item xs={10}>
        <Card>
          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Tus Datos</Typography>
            <p sx={cardCategoryWhiteStyles}>Puedes editar o completar tus datos</p>
          </CardHeader>
          <CardBody>
            <Grid container justifyContent="center">

              <Grid container item xs={12}>
                <Grid item xs={6} padding={2}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="email"
                    label="Correo Electrónico"
                    disabled
                    id="email"
                    value={email}
                    onChange={setForm} />
                </Grid>

                <Grid item xs={6} padding={2}>
                  <TextField
                    margin="normal"
                    fullWidth
                    disabled
                    name="password"
                    label="Contraseña"
                    id="password"
                    type="password"
                    value={"XXXXXXXXXXXXXXXX"} />
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Button variant="contained" color="secondary" onClick={handleOpenChangeCredentials} endIcon={<LockOpen />}>
                    Editar Correo/Contraseña
                  </Button>
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={6} padding={2}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="nombre"
                    label="Nombre"
                    id="nombre"
                    value={nombre}
                    onBlur={() => simpleValidator.current.showMessageFor('nombre')}
                    onChange={setForm} />
                  {simpleValidator.current.message('nombre', nombre, 'required', {
                    className: 'text-danger',
                    messages: { default: "Indica tu nombre." },
                    element: (message) => errorFormat(message)
                  })}
                </Grid>
                <Grid item xs={6} padding={2}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="apellido"
                    label="Apellido"
                    id="apellido"
                    value={apellido}
                    onBlur={() => simpleValidator.current.showMessageFor('apellido')}
                    onChange={setForm} />
                  {simpleValidator.current.message('apellido', apellido, 'required', {
                    className: 'text-danger',
                    messages: { default: "Indica un apellido." },
                    element: (message) => errorFormat(message)
                  })}
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={6} padding={2}>
                  <TextField
                    id="provincia"
                    fullWidth
                    name="provincia"
                    margin="normal"
                    select
                    label={"Provincia"}
                    value={provincia}
                    onChange={setForm}
                  >
                    {provincias.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.provincia}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} padding={2}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="ciudad"
                    label="Ciudad"
                    id="ciudad"
                    value={ciudad}
                    onChange={setForm} />
                </Grid>
              </Grid>

              <Grid item xs={12} padding={2}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  autoComplete="telefono"
                  value={telefono}
                  onBlur={() => simpleValidator.current.showMessageFor('telefono')}
                  onChange={setForm} />
                {simpleValidator.current.message('telefono', telefono, 'numeric|min:6', {
                  className: 'text-danger',
                  messages: { default: "El teléfono debe tener 6 o más números." },
                  element: (message) => errorFormat(message)
                })}
              </Grid>

              <Grid item xs={12} padding={2}>
                <FormControl fullWidth margin="normal" required >
                  <InputLabel id="generosMusicales">Elige tus Géneros Musicales</InputLabel>
                  <Select
                    fullWidth
                    labelId="generosMusicales"
                    id="generosMusicales"
                    multiple
                    value={generosMusicales}
                    onChange={handleAddGeneroMusical}
                    input={<OutlinedInput id="generosMusicales" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {generosMusicalesList.map((generoMusical) => (
                      <MenuItem key={generoMusical} value={generoMusical} style={getStyles(generoMusical)}>
                        {generoMusical}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardBody>

          <CardFooter>
            <Grid container item xs={12} justifyContent="center" spacing={2}>
              <ProgressButton
                textButton={buttonText}
                loading={openLoader}
                buttonState={editState}
                onClickHandler={handleSubmit}
                noneIcon={<Save />}
                color="secondary"
                noFab={false} />
            </Grid>
          </CardFooter>

        </Card>
      </Grid>

    </Grid>
  );
}

export default UserProfile;

const cardCategoryWhiteStyles = {
  color: "rgba(255,255,255,.62)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0"
}
const cardTitleWhiteStyles = {
  color: "rgba(255,255,255,255)",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300px",
  fontSize: "40px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}
