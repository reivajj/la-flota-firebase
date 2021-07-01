import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, MenuItem, TextField, makeStyles, Typography, Divider, CircularProgress } from '@material-ui/core';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SimpleReactValidator from "simple-react-validator";
import { createAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';
import firebase from "firebaseConfig/firebase.js";

import Button from "components/CustomButtons/Button.js";
import Danger from 'components/Typography/Danger.js';
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import CardFooter from "components/Card/CardFooter.js";
import ProgressButtonWithInputFile from 'components/CustomButtons/ProgressButtonWithInputFile';
// import ButtonWithInputFile from 'components/CustomButtons/ButtonWithInputFile';
import SelectDateInputDDMMYYYY from "components/DatesInput/SelectDateInputDDMMYYYY";
import { generosMusicales, languages } from 'services/DatosVarios';
// import NewTrackDialog from "views/Tracks/NewTrackDialog";

import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { trackActions, NewTrackDialog } from "views/Tracks/NewTrackDialog";


// firebase.functions().useEmulator("localhost", 5001);

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
);

const NewAlbum = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserData = useSelector(store => store.userData);
  const currentUserId = currentUserData.id;
  const myArtists = useSelector(store => store.artists.artists);
  const myLabels = useSelector(store => store.labels.labels);
  const myTracks = useSelector(store => store.tracks.tracks);

  // aca deberia tener guardado la cantidad de albumes en el userDoc, y de artists, y labels.
  const cantAlbumsFromUser = 1;

  const checkIfExistsProvisionalTracks = () => {
    return myTracks.filter(track => track.provisionalId)
      .map(trackWithAllInfo => [
          `${trackWithAllInfo.position}`,
          `${trackWithAllInfo.title}`,
          `${trackWithAllInfo.isrc}`,
          `${trackWithAllInfo.other_artists}`,
          "NO",
          `${trackWithAllInfo.explicit === 0 ? "NO" : "SI"}`,
          trackActions(),
          "0"
      ]);
  }

  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [tracksDataTable, setTracksDataTable] = useState(checkIfExistsProvisionalTracks());
  const [imageReference, setImageReference] = useState('');
  const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);
  const [artistForm, setArtistForm] = useState("");

  const [albumData, setAlbumData] = useState({
    nombreArtist: "", urlImagen: "", label_name: "", title: "",
    p_year: 2021, p_line: "", c_year: 2021, c_line: "", dayOfMonth: "",
    month: "", year: "", genre: "", language: "Spanish", disc_number: cantAlbumsFromUser
  });

  const [trackData, setTrackData] = useState({
    album_id: "", disc_number: cantAlbumsFromUser, explicit: 0,
    position: tracksDataTable.length + 1, title: "", track: "",
    price: "", lyrics: "", isrc: "", track_language: "",
    other_artists: "", composers: "", producers: "", primary_artist: "",
    artistId: ""
  });

  const allFieldsValidCreateAlbum = () => {
    if (simpleValidator.current.allValid()) {
      createAlbum();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createAlbum = async () => {
    let [errorCreatingAlbum] = await to(dispatch(createAlbumRedux({}, currentUserId)));
    if (errorCreatingAlbum) throw new Error("Error creating album: ", errorCreatingAlbum);

    navigate('admin/albums');
  }

  const getTrackFromLocal = (event) => {
    const trackFile = event.target.files[0];
    setCurrentFile(trackFile);
    console.log("El audio: ", trackFile);
  }


  const fileChangedHandler = (event) => {
    const file = event.target.files[0];
    setCurrentFile(file);
    if (file["size"] > 5242880) {
      setMessage("El archivo debe ser menor que 5 Mb");
    } else {
      const imageUuid = uuidv4();
      const storageRef = firebase
        .storage()
        .ref(`covers/${imageUuid}`)
        .put(file);
      storageRef.on(
        "state_changed",
        (snapshot) => {
          console.log("La Snapshot: ", snapshot);
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          //error function
          console.log(error);
        },
        () => {
          firebase
            .storage()
            .ref('covers')
            .child(`${imageUuid}`)
            .getDownloadURL()
            .then((url) => {
              setAlbumData({ ...albumData, urlImagen: url });
              const imageRef = firebase.storage().ref().child(`covers/${imageUuid}`);
              setImageReference(imageRef);
            });
        }
      );
    }
  };

  const handleNotAddImage = () => {
    imageReference ? (
      imageReference.delete()
        .then(() => navigate(-1))
        .catch(error => console.log("Dio ERROR: ", error)))
      : navigate(-1);
  };

  useEffect(() => {
    console.log("El FormData: ", currentFile);
    // UploadService.getFiles().then((response) => {
    //   setFileInfos(response.data);
    // });
  }, []);

  // formDataAlbum.append("c_line", dataAlbum.c_line);
  // formDataAlbum.append("label_name", dataAlbum.label_name);
  // formDataAlbum.append("p_line", dataAlbum.p_line);
  // formDataAlbum.append("release_date", dataAlbum.release_date);
  // formDataAlbum.append("sale_start_date", dataAlbum.sale_start_date);
  // formDataAlbum.append("title", dataAlbum.title);
  // formDataAlbum.append("cover", dataAlbum.cover);

  const handlerArtistChoose = event => {
    setArtistForm(event.target.value);
    setAlbumData({ ...albumData, nombreArtist: event.target.value.nombre, artistId: event.target.value.id });
    setTrackData({ ...trackData, primary_artist: event.target.value.nombre, artistId: event.target.value.id });
  };
  const handlerLabelChoose = event => setAlbumData({ ...albumData, label_name: event.target.value });
  const handlerAlbumTitle = event => setAlbumData({ ...albumData, title: event.target.value });
  const handlerPYearChoose = event => setAlbumData({ ...albumData, p_year: event.target.value });
  const handlerPLineChoose = event => setAlbumData({ ...albumData, p_line: event.target.value });
  const handlerCYearChoose = event => setAlbumData({ ...albumData, c_year: event.target.value });
  const handlerCLineChoose = event => setAlbumData({ ...albumData, c_line: event.target.value });
  const handlerDayOfMonth = event => setAlbumData({ ...albumData, dayOfMonth: event.target.value });
  const handlerMonth = event => setAlbumData({ ...albumData, month: event.target.value });
  const handlerYear = event => setAlbumData({ ...albumData, year: event.target.value });
  const handlerLanguageChoose = event => setAlbumData({ ...albumData, language: event.target.value });
  const handlerGenreChoose = event => setAlbumData({ ...albumData, genre: event.target.value });

  const trackUploadProgress = () => {
    return (
      <CircularProgress variant="determinate" value={progress} size={24} className={classes.buttonProgress} />
    )
  }

  return (
    <Grid container spacing={2} style={{ textAlign: "center" }}>
      <Grid item xs={12} >
        <Typography variant="h3">Información General</Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          name="nombreArtist"
          className={classes.textField}
          autoFocus
          id="nombreArtist"
          variant="outlined"
          required
          margin="normal"
          select
          label="Artista"
          value={artistForm}
          onChange={handlerArtistChoose}
          helperText="Selecciona al Artista, si es que ya lo tienes en el sistema. Si no, primero debés crear un Artista."
        >
          {myArtists.map((artist) => (
            <MenuItem key={artist.id} value={artist}>
              {artist.nombre}
            </MenuItem>
          ))}
          {simpleValidator.current.message('nombreArtist', artistForm, 'required', {
            className: 'text-danger',
            messages: { default: "Debes seleccionar al Artista del Nuevo Lanzamiento." },
            element: (message) => errorFormat(message)
          })}
        </TextField>

        <TextField
          name="title"
          className={classes.textField}
          id="title"
          variant="outlined"
          required
          margin="normal"
          label="Título del Lanzamiento"
          value={albumData.title}
          onChange={handlerAlbumTitle}
          helperText="No pueden ir nombres de Productores, Compositores, Artistas invitados (feat.), 
            etc. Se completan más adelante en los campos correspondientes."
        />
        {simpleValidator.current.message('title', albumData.title, 'required|max:50', {
          className: 'text-danger',
          messages: { default: "Debes ingresar el Título del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}

        <TextField
          name="label_name"
          className={classes.textField}
          id="label_name"
          variant="outlined"
          required
          margin="normal"
          select
          label="Sello Discográfico"
          value={albumData.label_name}
          onChange={handlerLabelChoose}
          helperText="Selecciona el sello discográfico, si no tienes selecciona el nombre del Artista."
        >
          {albumData.nombreArtist &&
            <MenuItem key={albumData.nombreArtist} value={albumData.nombreArtist}>
              {albumData.nombreArtist}
            </MenuItem>
          }
          {myLabels.map(label => (
            <MenuItem key={label.nombre} value={label.nombre}>
              {label.nombre}
            </MenuItem>
          ))}
        </TextField>
        {simpleValidator.current.message('label_name', albumData.label_name, 'required|max:50', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar un sello para el Lanzamiento." },
          element: (message) => errorFormat(message)
        })}

      </Grid>

      <Grid item xs={6}>
        <ProgressButtonWithInputFile
          textButton={progress === 100 ? "Cambiar Tapa" : "Arte de Tapa"}
          loading={progress > 0 && progress < 100}
          buttonState={progress < 100 ? "none" : "success"}
          onClickHandler={fileChangedHandler}
          progress={progress} />

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        {!albumData.urlImagen && (
          <Grid>
            <SkeletonTheme color="aliceblue" >
              <Skeleton variant="rect" width={250} height={220} />
            </SkeletonTheme>
          </Grid>
        )}

        {albumData.urlImagen && (
          <Grid >
            <img
              style={{ width: 250, height: 220 }}
              alt={""}
              src={albumData.urlImagen}
            />
          </Grid>
        )}
      </Grid>

      {/* <Grid item xs={6}>
        <Divider variant="fullWidth" style={{ position: "inherit", height: "3px", backgroundColor: "darkslateblue" }} absolute={true} />
      </Grid> */}

      <Grid item xs={6}>
        <TextField
          className={classes.textField}
          name="p_year"
          id="p_year"
          variant="outlined"
          required
          margin="normal"
          select
          label="(P) Año de Publicación"
          value={albumData.p_year}
          onChange={handlerPYearChoose}
          helperText="Año en que esta grabación del Álbum/Single fue publicada por primera vez."
        >
          {Array.from({ length: 30 }, (x, i) => 2021 - i).map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
        {simpleValidator.current.message('p_year', albumData.p_year, 'required', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar un año de publicación del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}

        <TextField
          name="p_line"
          className={classes.textField}
          id="p_line"
          variant="outlined"
          required
          margin="normal"
          label="Publicador (Publisher)"
          value={albumData.p_line}
          onChange={handlerPLineChoose}
          helperText="El dueño de los Derechos de Publicación de esta grabación.
          → Ej. 1: Fito Paez | Ej. 2: Sony Music"
        />
        {simpleValidator.current.message('p_line', albumData.p_line, 'required|max:50', {
          className: 'text-danger',
          messages: { default: "Por favor indicá el publicador del lanzamiento." },
          element: (message) => errorFormat(message)
        })}

      </Grid>

      <Grid item xs={6}>
        <TextField
          name="c_year"
          className={classes.textField}
          id="c_year"
          variant="outlined"
          required
          margin="normal"
          select
          label="(C) Año de Copyright"
          value={albumData.c_year}
          onChange={handlerCYearChoose}
          helperText="Año en que el Álbum/Single fue publicado por primera vez."
        >
          {Array.from({ length: 30 }, (x, i) => 2021 - i).map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
        {simpleValidator.current.message('c_year', albumData.c_year, 'required', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar un año de publicación del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}

        <TextField
          name="c_line"
          className={classes.textField}
          id="c_line"
          variant="outlined"
          required
          margin="normal"
          label="Copyright"
          value={albumData.c_line}
          onChange={handlerCLineChoose}
          helperText="El dueño de los Derechos de Autor.
          → Si tu lanzamiento contiene Covers debes agregar el nombre de los autores originales acá (Por ej.: Luis Alberto Spinetta)."
        >
        </TextField>
        {simpleValidator.current.message('c_line', albumData.c_line, 'required|max:50', {
          className: 'text-danger',
          messages: { default: "Por favor indicá el dueño de los derechos de autor del lanzamiento." },
          element: (message) => errorFormat(message)
        })}

      </Grid>

      <Grid item xs={12}>
        <Typography variant="h3">Fecha del Lanzamiento</Typography>
      </Grid>

      {/* <Grid item xs={12} style={{ textAlign: '-moz-center' }}>
        <p style={{ width: '800px', textAlign: 'justify' }}>
          Elegí la fecha en la que querés que este lanzamiento sea publicado en las tiendas. Si elegís la fecha de hoy, o mañana, no significa que tu lanzamiento va a estar disponible inmediatamente. Se procesará con la fecha que seleccionaste pero según la demanda, los lanzamientos pueden demorar hasta 1-2 días en aprobarse y procesarse, a la vez las tiendas tienen tiempos variables, y por último puede haber errores o que necesitemos corregir aspectos de tu lanzamiento.
          <br />Por lo que: Si es muy importante que tu álbum se publique en una fecha exacta del futuro (por ej, para una campaña promocional), recomendamos trabajar y seleccionar una fecha con al menos 14 días de anticipación, en la cual podemos asegurarte que estará disponible en la mayoría de las tiendas principales a la vez.
          <br />Si es tu primer lanzamimport {CircularProgress} from '@material-ui/core/CircularProgress';
          iento (y aún no tenés perfilimport MyAlbums from './MyAlbums';
 en las tiendas) recomendamos que elijas una fecha de acá a 5-7 días en el futuro para que tu perfil se cree correctamente.
        </p>
      </Grid> */}

      <SelectDateInputDDMMYYYY dayValue={albumData.dayOfMonth} monthValue={albumData.month} yearValue={albumData.year}
        setDayOfMonth={handlerDayOfMonth} setMonth={handlerMonth} setYear={handlerYear} simpleValidator={simpleValidator} />

      <Grid container item spacing={2} xs={12} justify="center">
        <Grid item xs={3}>
          <TextField
            name="language"
            fullWidth
            id="language"
            variant="outlined"
            required
            margin="normal"
            select
            label="Idioma Principal del Lanzamiento"
            value={albumData.language}
            onChange={handlerLanguageChoose}
          >
            {languages.map(language => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={3}>
          <TextField
            name="generosMusicales"
            id="generosMusicales"
            fullWidth
            variant="outlined"
            required
            margin="normal"
            select
            label="Género Musical Principal"
            value={albumData.genre}
            onChange={handlerGenreChoose}
          >
            {generosMusicales.map(genre => (
              <MenuItem key={genre.value} value={genre.value}>
                {genre.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h3">Canciones del Lanzamiento</Typography>
      </Grid>

      <Grid item xs={12} style={{ textAlign: '-moz-center' }}>
        <p style={{ width: '800px', textAlign: 'justify' }}>
          Agregá los Tracks de tu Lanzamiento!
          <br />Completá todos los datos de las canciones con cuidado, exactamente como quieras que se vean en las tiendas.
          <br />Respetá minúsculas, mayúsculas y acentos en los títulos.
          <br />En el nombre de la canción no pueden ir productores, artistas invitados (feat.), etc. Cada uno debe ir en el campo correspondiente.
        </p>
      </Grid>

      <Grid item xs={12}>
        <Card className={classes.tableCard}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Simple Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Nº Track", "Título", "ISRC", "Artistas Invitados", "Es un Cover?", "Lenguaje inapropiado?", "Acciones", "Carga"]}
              tableData={tracksDataTable}
            />
          </CardBody>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button color="primary" onClick={() => setOpenNewTrackDialog(true)} >Agregar Canción</Button>
      </Grid>

      <Grid item xs={12}>
        <NewTrackDialog openDialog={openNewTrackDialog} setOpenNewTrackDialog={setOpenNewTrackDialog} setTracksDataTable={setTracksDataTable}
          tracksDataTable={tracksDataTable} trackData={trackData} setTrackData={setTrackData} />
      </Grid>

      <Grid item xs={12}>
        <CardFooter style={{ display: 'inline-flex' }}>
          <Button color="primary" onClick={allFieldsValidCreateAlbum} style={{ textAlign: "center" }}>Finalizar</Button>
        </CardFooter>
      </Grid>
    </Grid>
  );
}

export default NewAlbum;

const styles = {
  textField: {
    width: "500px"
  },
  skeleton: {
    background: 'red',
  },
  centerGrid: {
    textAlign: "center"
  },
  tableCard: {
    display: "inline-flex",
    width: "60%"
  }
};

const useStyles = makeStyles(styles);