import React, { useRef, useState } from "react";
import useForm from '../../customHooks/useForm';
import {
  Grid, Typography, Button, TextField, ThemeProvider, Box,
  MenuItem, FormControl, Select, Chip, InputLabel, OutlinedInput
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import * as actions from "../../redux/actions/UserDataActions";
import SaveIcon from '@mui/icons-material/Save';
import SimpleReactValidator from 'simple-react-validator';
import { unstable_createMuiStrictModeTheme as createTheme } from '@mui/material';
import ReauthenticateDialog from "../../components/Dialogs/ReauthenticateDialog";
import { provincias, generosMusicalesList } from '../../services/DatosVarios';
import useForceUpdate from 'components/Varios/ForceUpdate.js';

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

const UserProfileTest = () => {

  const getStyles = (generoMusical) => {
    return {
      fontWeight:
        generosMusicalesList.indexOf(generoMusical) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const simpleValidator = useRef(new SimpleReactValidator());

  const forceUpdate = useForceUpdate();

  let errorFormat = (message) => (<ThemeProvider theme={theme}>
    <Typography color="error" variant="h6">{message}</Typography>
  </ThemeProvider>)

  // tomo los parametros del query serach de la URL
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userData = useSelector(store => store.userData);

  let [openChangeCredentialsDialog, setOpenChangeCredentialsDialog] = useState(false);

  let provinciaDelUsuarioActual = userData.provincia ? provincias.filter(provincia => provincia.value === userData.provincia)[0].value : "";

  let defaultData = {
    nombre: userData.nombre || "",
    apellido: userData.apellido || "",
    provincia: provinciaDelUsuarioActual,
    telefono: userData.telefono || "",
    ciudad: userData.ciudad || "",
    email: userData.email,
    stats: userData.stats,
    imagenUrl: userData.imagenUrl
  };

const handleSubmit = () => {
  console.log("A");
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

  // const edit = () => {
  //   if (checkFields()) {
  //     console.log("Toda la Data:", { ...formData, generosMusicales: generosMusicales });
  //     dispatch(actions.editPerfil({ ...formData, generosMusicales: generosMusicales, id: userData.id, rol: userData.rol }))
  //       .then(() => navigate(-1));
  //   }
  // }

  const [formData, setForm] = useForm(defaultData);

  const handleChange = (event) => {
    setEspecialidades(event.target.value);
  }

  const handleOpenChangeCredentials = () => {
    setOpenChangeCredentialsDialog(true);
  }

  let { email, nombre, apellido, ciudad, provincia, telefono, stats, imagenUrl } = formData;

  const [generosMusicales, setEspecialidades] = useState(userData.generosMusicales || []);

  return (
    <Grid container justifyContent='center' textAlign='center' padding={1}>
      <Grid item xs={12}>
        <Typography variant="h2" sx={titleStyles}>
          Mis Datos
        </Typography>
      </Grid>

      <ReauthenticateDialog isOpen={openChangeCredentialsDialog} setIsOpen={setOpenChangeCredentialsDialog}
        textName={userData.nombre} />

      <Grid container item xs={8}>
        <Grid item xs={6} padding={1}>
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

        <Grid item xs={6} padding={1}>
          <TextField
            margin="normal"
            fullWidth
            disabled
            name="password"
            label="Contraseña"
            id="password"
            type="password"
            value={"XXXXXXXX"} />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleOpenChangeCredentials}>Editar Correo/Contraseña</Button>
        </Grid>
      </Grid>



      <Grid container item xs={8}>
        <Grid item xs={12} padding={1}>
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
            messages: { default: "Indica un nombre para el Usuario." },
            element: (message) => errorFormat(message)
          })}
        </Grid>
      </Grid>

      <Grid container item xs={8}>
        <Grid item xs={6} padding={1}>
          <TextField
            margin="normal"
            fullWidth
            required
            name="ciudad"
            label="Ciudad"
            id="ciudad"
            value={ciudad}
            onBlur={() => simpleValidator.current.showMessageFor('ciudad')}
            onChange={setForm} />
          {simpleValidator.current.message('ciudad', ciudad, 'required', {
            className: 'text-danger',
            messages: { default: "Debes ingresar la ciudad en la que resides." },
            element: (message) => errorFormat(message)
          })}
        </Grid>

        <Grid item xs={8} padding={1}>
          <TextField
            id="provincia"
            fullWidth
            name="provincia"
            required
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
          {simpleValidator.current.message('provincia', provincia, 'required', {
            className: 'text-danger',
            messages: { default: "Debe indicar su privincia." },
            element: (message) => errorFormat(message)
          })}
        </Grid>

      </Grid>

      <Grid item xs={6} padding={1}>
        <TextField
          margin="normal"
          fullWidth
          required
          id="telefono"
          label="Teléfono"
          name="telefono"
          autoComplete="telefono"
          value={telefono}
          onBlur={() => simpleValidator.current.showMessageFor('telefono')}
          onChange={setForm} />
        {simpleValidator.current.message('telefono', telefono, 'required|numeric|min:6', {
          className: 'text-danger',
          messages: { default: "El teléfono debe tener 6 o más números." },
          element: (message) => errorFormat(message)
        })}
      </Grid>

      <Grid item xs={8}>
        <FormControl sx={{ m: 1 }} fullWidth margin="normal" required >
          <InputLabel id="generosMusicales">Elige tus Generos Musicales</InputLabel>
          <Select
            fullWidth
            labelId="generosMusicales"
            id="generosMusicales"
            multiple
            value={generosMusicales}
            onChange={handleChange}
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
        {simpleValidator.current.message('generosMusicales', generosMusicales, 'required', {
          className: 'text-danger',
          messages: { default: "Elija al menos una especialidad." },
          element: (message) => errorFormat(message)
        })}
      </Grid>


      <Grid container item xs={12} justifyContent="center" spacing={2}>
        <Grid item >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            sx={buttonStyles}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid item >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            sx={buttonStyles}
            endIcon={<SaveIcon />}
          >
            Confirmar
          </Button>
        </Grid>
      </Grid>
    </Grid >
  );

}

const titleStyles = {
  margin: theme.spacing(2, 0, 2)
}

const buttonStyles = {
  margin: "1em 0 1em",
  height: "30px",
  width: "140px",
}

export default UserProfileTest;