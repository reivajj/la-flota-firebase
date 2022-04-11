import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import { Grid, Typography, Button } from '@mui/material';
import SimpleReactValidator from "simple-react-validator";
import { albumCleanUpdatingAlbum, createAlbumRedux, updateAddingAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';

import SelectDateInputDDMMYYYY from "components/Input/SelectDateInputDDMMYYYY";
import { allFugaGenres } from "variables/genres";
import TracksTable from "components/Table/TracksTable";
import { NewTrackDialog } from "views/Tracks/NewTrackDialog";
import { deleteTrackInTracksUploading, tracksCleanUploadingTracks, uploadAllTracksToAlbumRedux } from "redux/actions/TracksActions";

import ProgressButton from "components/CustomButtons/ProgressButton";
import { Save, AddCircleOutline, Edit } from '@mui/icons-material/';
import {
  albumCoverHelperText, lanzamientoColaborativoTooltip, oldReleaseCheckBoxHelper,
  preSaleCheckBoxHelper, releaseDateInfoTooltip, imageConstraintsMessage
} from '../../utils/textToShow.utils';
import { toWithOutError, to, useForceUpdate } from "utils";
import { manageAddImageToStorage } from "services/StorageServices";
import TextFieldWithInfo from "components/TextField/TextFieldWithInfo";
import AddOtherArtistsAlbumForm from 'components/Forms/AddOtherArtistsAlbumForm';
import ImageInput from "components/Input/ImageInput";
import { createOtherArtistsRedux } from '../../redux/actions/ArtistsInvitedActions';
import { updateAddingAlbumImageUrlAndCoverRedux, createUPCToSuccessAlbumRedux, albumsPublishAndDeliveryRedux } from '../../redux/actions/AlbumsActions';
import TypographyWithInfo from '../../components/Typography/TypographyWithInfo';
import CheckboxWithInfo from '../../components/Checkbox/CheckboxWithInfo';
import { createCollaboratorsRedux } from "redux/actions/CollaboratorsActions";
import { languagesFuga } from '../../variables/varias';
import TextFieldWithInfoImage from '../../components/TextField/TextFieldWithInfoImage';
import NewArtist from 'views/Artists/NewArtist';
import { getAllOtherArtistsFromAlbumAndTrack, artistsWithUniqueName } from '../../utils/artists.utils';
import SuccessDialog from '../../components/Dialogs/SuccessDialog';
import TextFieldWithAddElement from '../../components/TextField/TextFieldAddElement';
import EditOrAddFieldsDialog from '../../components/Dialogs/EditOrAddFieldDialog';
import { createSubgenreRedux } from "redux/actions/UserDataActions";
import InfoDialog from '../../components/Dialogs/InfoDialog';
import { createLabelRedux } from "redux/actions/LabelsActions";
import { getActualYear } from 'utils/timeRelated.utils';
import { checkIfAnyTrackIsExplicit } from "utils/tracks.utils";
import { trackUploadProgress, getTracksAsDataTable } from '../../utils/tables.utils';
import useScript from '../../customHooks/useScript';
import DspsDialog from "views/DSP/DspsDialog";
import { checkFieldsCreateAlbum, getDeliveredContentTextDialog, getDeliveredTitleDialog, adaptAlbumToAppleFormat } from '../../utils/albums.utils';


const NewAlbum = ({ editing }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserData = useSelector(store => store.userData);
  const currentUserId = currentUserData.id; const currentUserEmail = currentUserData.email;
  const currentAlbumData = useSelector(store => store.albums.addingAlbum);
  const myArtists = useSelector(store => store.artists.artists);
  const myLabels = useSelector(store => store.labels.labels);
  const myTracks = useSelector(store => store.tracks.uploadingTracks);
  const artistInvited = useSelector(store => store.artistsInvited);
  // aca deberia tener guardado la cantidad de albumes en el userDoc, y de artists, y labels.
  const cantAlbumsFromUser = "";

  const topElementRef = useRef(null);
  const scrollToTop = () => topElementRef.current ? topElementRef.current.scrollIntoView() : null;

  useScript("https://cdn.jsdelivr.net/npm/wavefile");

  useEffect(() => {
    setTracksDataTable(getTracksAsDataTable(myTracks, handleEditTrack, handleDeleteTrack) || [[]]);
  }, [myTracks])

  useEffect(() => {
    if (currentAlbumData.appleAdapted) allFieldsValidCreateAlbum();
  }, [currentAlbumData.appleAdapted])

  const changeAlbumId = () => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, id: uuidv4() }));
  const putAlbumIdOnEditingArtist = () => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, id: currentAlbumData.id }));

  useEffect(() => {
    if (!editing) changeAlbumId();
    else putAlbumIdOnEditingArtist();
  }, [])

  const handleDeleteTrack = trackInfo => dispatch(deleteTrackInTracksUploading(trackInfo.id));
  const handleEditTrack = trackInfo => {
    setTrackData(trackInfo);
    setOpenNewTrackDialog(true);
  }

  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false);

  const [progress, setProgress] = useState(0);
  const [messageForCover, setMessageForCover] = useState("");
  const [tracksDataTable, setTracksDataTable] = useState(getTracksAsDataTable(myTracks, handleEditTrack, handleDeleteTrack) || [[]]);

  const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);
  const [openAddSubgenre, setOpenAddSubgenre] = useState(false);
  const [openAddLabel, setOpenAddLabel] = useState(false);
  const [openLoaderLabelCreate, setOpenLoaderLabelCreate] = useState(false);
  const [openLoaderSubgenreCreate, setOpenLoaderSubgenreCreate] = useState(false);
  const [openInvalidValueDialog, setOpenInvalidValueDialog] = useState({ open: false, beginner: "", title: "", text: [""] });
  const [openLoader, setOpenLoader] = useState(false);

  const [deliveryState, setDeliveryState] = useState('none');
  const [openSelectDSP, setOpenSelectDSP] = useState(false);

  const [creatingAlbumState, setCreatingAlbumState] = useState("none");
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");
  const [selloInStore, setSelloInStore] = useState(false);

  const [trackData, setTrackData] = useState({
    disc_number: cantAlbumsFromUser, explicit: false, allOtherArtists: [],
    subgenre: currentAlbumData.subgenre, genreName: currentAlbumData.genreName,
    subgenreName: currentAlbumData.subgenreName, genre: currentAlbumData.genre,
    position: tracksDataTable.length + 1, title: "", track: "", artists: [],
    price: "", lyrics: "", isrc: "", track_language_name: currentAlbumData.languageName,
    track_language_id: currentAlbumData.languageId, progress: 0, id: "", preview: currentAlbumData.preview,
    collaborators: [{ name: "", roles: ["COMPOSER"] }, { name: "", roles: ["LYRICIST"] }],
    preOrder: currentAlbumData.preOrder, audio_locale_name: "",
  });

  const handleSelectDSPs = () => setOpenSelectDSP(true);
  let successDialogTitle = getDeliveredTitleDialog(deliveryState);
  let successDialogText = getDeliveredContentTextDialog(deliveryState);

  const handleDelivery = async albumUploaded => {
    let dspsToDelivery = albumUploaded.dsps.filter(dsp => dsp.checked);
    let responsePublishAndDelivery = await toWithOutError(dispatch(albumsPublishAndDeliveryRedux(albumUploaded, dspsToDelivery, 'all')));
    if (responsePublishAndDelivery === "ERROR") return "ERROR";
    if (responsePublishAndDelivery === "PUBLISHED") { setDeliveryState('published'); return; }
    if (responsePublishAndDelivery === "DELIVERED") { setDeliveryState('delivered'); return; }
    handleCloseSuccessUpload();
  }

  const coverLabelArtistAllValids = () => {
    if (!currentAlbumData.cover?.size) setMessageForCover("Debes seleccionar el Arte de Tapa");
    if (!currentAlbumData.nombreArtist) validator.current.showMessageFor('nombreArtist');
    if (!currentAlbumData.label_name) validator.current.showMessageFor('label_name');
    if (needArtistLabelCover) {
      handleSelectDSPs();
      dispatch(updateAddingAlbumRedux({ ...currentAlbumData, basicFieldsComplete: true }));
    }
  }

  const allFieldsValidCreateAlbum = () => {
    let validationResult = checkFieldsCreateAlbum(currentAlbumData, myTracks, setOpenInvalidValueDialog, validator, scrollToTop);
    if (validationResult === "ALL_VALID") createAlbum();
    else {
      validator.current.showMessages();
      forceUpdate();
    }
  }

  const handleCloseInfoDialog = () => {
    if (openInvalidValueDialog.beginner === "single-track-name") {
      adaptAlbumToAppleFormat(currentAlbumData, myTracks, dispatch);
    }
    setOpenInvalidValueDialog({ open: false, beginner: "", title: "", text: [""] });
  }


  const createAlbum = async () => {
    setOpenLoader(true);
    let albumDataFromFuga = ""; let responseTracksFromFuga = ""; let internalState = "";
    const allOtherArtistsNotRepeatedFromTracksAndAlbum = artistsWithUniqueName([...currentAlbumData.allOtherArtists, ...myTracks.map(track => track.allOtherArtists).flat()]);

    const otherPrimaryArtistsOfTheAlbumCreatedInFuga = await toWithOutError(dispatch(createOtherArtistsRedux(allOtherArtistsNotRepeatedFromTracksAndAlbum
      , currentUserId, currentUserEmail, artistInvited, currentAlbumData)))
    if (otherPrimaryArtistsOfTheAlbumCreatedInFuga === "ERROR") {
      setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
      return;
    }
    else internalState = "artists-created"; setCreatingAlbumState("artists-created");

    if (internalState === "artists-created") {
      const explicitAlbum = checkIfAnyTrackIsExplicit(myTracks);
      albumDataFromFuga = await toWithOutError(dispatch(createAlbumRedux(currentAlbumData, currentUserId, currentUserEmail, explicitAlbum, myTracks, artistInvited)));
      if (albumDataFromFuga === "ERROR") {
        setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
        return;
      }
      else internalState = "album-created"; setCreatingAlbumState("album-created");
    }

    if (internalState === "album-created") {
      responseTracksFromFuga = await toWithOutError(dispatch(uploadAllTracksToAlbumRedux(myTracks, albumDataFromFuga.id,
        albumDataFromFuga.fugaId, currentUserId, currentUserEmail, artistInvited, otherPrimaryArtistsOfTheAlbumCreatedInFuga)));
      if (responseTracksFromFuga === "ERROR") {
        setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
        return;
      }
      else internalState = "tracks-created"; setCreatingAlbumState("tracks-created");
    }

    if (internalState === "tracks-created") {
      const tracksCollaboratorsResponse = await toWithOutError(dispatch(createCollaboratorsRedux(responseTracksFromFuga,
        currentUserId, currentUserEmail)))
      if (tracksCollaboratorsResponse === "ERROR") {
        setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
      }
      else internalState = "collaborators-created"; setCreatingAlbumState("collaborators-created");
    }

    if (internalState === "collaborators-created" || internalState === "tracks-created") {
      await toWithOutError(dispatch(createUPCToSuccessAlbumRedux(albumDataFromFuga)));
      internalState === "collaborators-created" ? await handleDelivery(albumDataFromFuga) : setCreatingAlbumState("success");
      setButtonState("success");
    }
    setOpenLoader(false);
  }

  const onClickAddImage = async (event) => {
    updateAddingAlbumImageUrlAndCoverRedux({ imagenUrl: "", cover: "" });
    setMessageForCover("");
    let img = new Image()
    let imageFile = event.target.files[0];
    if (imageFile.type !== "image/jpeg") {
      setOpenInvalidValueDialog({
        open: true, beginer: "not-jpg-image", title: "La imagen debe tener formato JPG/JPEG", text: ["Por favor, selecciona una imagen con ese formato."]
      });
      return;
    }
    img.src = window.URL.createObjectURL(imageFile)
    img.onload = async () => {
      if (img.width >= 3000 && img.height >= 3000 && img.width <= 6000 && img.height <= 6000 && img.width === img.height) {
        setMessageForCover("");
        let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(imageFile, currentAlbumData.id, 'covers', 1048576 * 20, setMessageForCover, setProgress));
        if (errorAddingFile) {
          setMessageForCover("Ha ocurrido un error, por favor, intente nuevamente. ");
          return;
        }
        dispatch(updateAddingAlbumImageUrlAndCoverRedux({ imagenUrl: urlAndFile.url, cover: urlAndFile.file }));
        setMessageForCover("");
      }
      else setMessageForCover(imageConstraintsMessage);
    }
  }

  const handleClickAddTrack = () => {
    let artistFromLaFlota = [{ name: currentAlbumData.nombreArtist, fugaId: currentAlbumData.artistFugaId, primary: true, id: currentAlbumData.artistId }];
    setTrackData({
      ...trackData, position: tracksDataTable.length + 1, artists: [...artistFromLaFlota,
      ...getAllOtherArtistsFromAlbumAndTrack(artistFromLaFlota[0], artistsWithUniqueName(currentAlbumData.allOtherArtists), artistsWithUniqueName([...myTracks.map(track => track.allOtherArtists).flat()]))],
      preview: currentAlbumData.preview, preOrder: currentAlbumData.preOrder, isrc: "", explicit: false,
    })
    setOpenNewTrackDialog(true);
  }

  const getArtistIdAndFugaIdFromName = artistName => {
    let artistResult = myArtists.filter(artist => artist.name === artistName)[0];
    return { artistFugaId: artistResult.fugaId, artistId: artistResult.id };
  }

  const handlerArtistChoose = event => {
    const { artistFugaId, artistId } = getArtistIdAndFugaIdFromName(event.target.value);
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, nombreArtist: event.target.value, artistFugaId, artistId }));
    setTrackData({ ...trackData, primary_artist: event.target.value, artistFugaId });
  };

  const getLabelIdFromName = labelName => myLabels.filter(label => label.name === labelName)[0].fugaId;

  const handlerLabelChoose = event => {
    if (event.target.value === "Crea un nuevo sello") return;
    const labelFugaId = getLabelIdFromName(event.target.value);
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, label_name: event.target.value, labelFugaId }));
  }

  const handlerBasicUpdateAlbum = (value, targetField) => {
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, [`${targetField}`]: value }));
  }

  const handlerLanguageChoose = event => {
    let language = languagesFuga.find(l => l.name === event.target.value);
    if (language === undefined) language.id = "ES";
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, languageId: language.id, languageName: event.target.value }));
  }

  const handlerGenreChoose = event => {
    let genreId = allFugaGenres.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, genre: genreId, genreName: event.target.value });
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, genre: genreId, genreName: event.target.value }));
  }

  const handlerSubgenreChoose = event => {
    if (event.target.value === "Crea tu propio subgénero") return;
    let subgenreId = currentUserData.subgenerosPropios.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, subgenre: subgenreId, subgenreName: event.target.value });
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, subgenre: subgenreId, subgenreName: event.target.value }));
  }

  const handleCreateSubgenre = async subgenreName => {
    setOpenLoaderSubgenreCreate(true);
    const createSubgenreResponse = await toWithOutError(dispatch(createSubgenreRedux(subgenreName, currentUserId)))

    if (createSubgenreResponse === "ERROR") {
      setButtonState("error");
      setOpenLoaderSubgenreCreate(false);
      return "ERROR";
    }

    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, subgenre: createSubgenreResponse.id, subgenreName }));
    setTrackData({ ...trackData, subgenreName, subgenre: createSubgenreResponse.id });
    setOpenLoaderSubgenreCreate(false);
    setOpenAddSubgenre(false);
  }

  const handleCreateLabel = async labelName => {
    setOpenLoaderLabelCreate(true);
    const createLabelResponse = await toWithOutError(dispatch(createLabelRedux({ name: labelName, details: "" }, currentUserId)))

    if (createLabelResponse === "SELLO_IN_STORE") setSelloInStore(true);
    if (createLabelResponse === "ERROR") {
      setButtonState("error");
      setOpenLoaderLabelCreate(false);
      return "ERROR";
    }

    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, label_name: labelName, labelFugaId: createLabelResponse.fugaId }));
    setOpenLoaderLabelCreate(false);
    setOpenAddLabel(false);
  }

  const handlerUPC = event => {
    if (event.target.value.length <= 13) dispatch(updateAddingAlbumRedux({ ...currentAlbumData, upc: event.target.value }));
    validator.current.showMessageFor('upc');
  }

  const yearsArray = Array.from({ length: 30 }, (_, i) => getActualYear() - i);

  const needArtistLabelCover = currentAlbumData.nombreArtist && currentAlbumData.label_name && currentAlbumData.cover;
  const needArtistLabelCoverAndContinue = currentAlbumData.nombreArtist && currentAlbumData.label_name && currentAlbumData.cover && currentAlbumData.basicFieldsComplete;
  const showingNotBasicAlbumFields = needArtistLabelCoverAndContinue || openLoader;

  const handleCloseSuccessUpload = () => {
    dispatch(albumCleanUpdatingAlbum());
    dispatch(tracksCleanUploadingTracks());
    navigate('/admin/albums');
  }

  return (
    <Grid container textAlign="center">
      <Card style={{ alignItems: "center", borderRadius: "30px" }} >

        <SuccessDialog isOpen={deliveryState !== 'none' && deliveryState !== 'processing'} title={successDialogTitle} contentTexts={successDialogText}
          handleClose={handleCloseSuccessUpload} successImageSource="/images/success.jpg" size="sm" />

        <DspsDialog isOpen={openSelectDSP} setIsOpen={setOpenSelectDSP} currentAlbumData={currentAlbumData} />

        <SuccessDialog isOpen={selloInStore} title={`El sello que intentas crear, ya existe asociado a tu cuenta.`} contentTexts={[[`Seleccionalo, en vez de crear uno nuevo.`]]}
          handleClose={() => setSelloInStore(false)} successImageSource="/images/successArtists.jpg" />

        <SuccessDialog isOpen={creatingAlbumState === "success"} title="¡Felicitaciones!" contentTexts={[["Tu lanzamiento ya se encuentra en etapa de de revisión"]]}
          handleClose={handleCloseSuccessUpload} successImageSource="/images/success.jpg" />

        <InfoDialog isOpen={openInvalidValueDialog.open} handleClose={handleCloseInfoDialog}
          title={openInvalidValueDialog.title} contentTexts={openInvalidValueDialog.text} />

        <EditOrAddFieldsDialog isOpen={openAddSubgenre} handleCloseDialog={() => setOpenAddSubgenre(false)} handleConfirm={handleCreateSubgenre}
          title="Crea un subgénero" subtitle="Puedes agregar el subgénero que desees." labelTextField="Nuevo subgénero" loading={openLoaderSubgenreCreate}
          buttonState={buttonState} />

        <EditOrAddFieldsDialog isOpen={openAddLabel} handleCloseDialog={() => setOpenAddLabel(false)} handleConfirm={handleCreateLabel}
          title="Crea un Sello" subtitle="Puedes agregar un nuevo sello." labelTextField="Nuevo sello." loading={openLoaderLabelCreate}
          buttonState={buttonState} />

        <Grid item xs={12} sx={{ width: "60%" }}>
          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Lanzamiento</Typography>
          </CardHeader>
        </Grid>

        <Grid container item xs={12} paddingTop={4}>

          <ImageInput key="new-album" imagenUrl={currentAlbumData.imagenUrl} onClickAddImage={onClickAddImage}
            textButton={currentAlbumData.imagenUrl === "" ? "Arte de Tapa" : "Cambiar"} progress={progress} message={messageForCover}
            helperText={albumCoverHelperText}
          />

          <NewArtist editing={false} view="dialog" isOpen={openAddArtistDialog} handleClose={() => setOpenAddArtistDialog(false)} />

          <Grid container item xs={12} >

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => setOpenAddArtistDialog(true)}
                sx={buttonAddArtist}
                endIcon={<AddCircleOutline />}>
                Crear Artista Principal
              </Button>
            </Grid>

            <Grid item xs={12} ref={topElementRef}>
              <TextFieldWithInfo
                name="nombreArtist"
                sx={textFieldLaFlotaArtistStyle}
                autoFocus
                required
                select
                label="Artista Principal"
                value={currentAlbumData.nombreArtist}
                onChange={handlerArtistChoose}
                helperText="Selecciona al Artista Principal, si es que ya lo tienes en el sistema. Si no, primero debés crear un Artista."
                selectItems={myArtists}
                selectKeyField="id"
                selectValueField="name"
                validatorProps={{ restrictions: 'required', message: "Debes seleccionar al Artista del Nuevo Lanzamiento.", validator: validator }}
              />
            </Grid>

          </Grid>

          <AddOtherArtistsAlbumForm
            checkBoxLabel="¿Lanzamiento Colaborativo?"
            checkBoxHelper={lanzamientoColaborativoTooltip}
            checkBoxColor="#9c27b0"
            buttonColor="#9c27b0"
            validator={validator}
          />

          {(currentAlbumData.dsps.filter(dsp => dsp.checked).length > 0 || showingNotBasicAlbumFields) &&
            <Grid item xs={12}>
              <Button variant="contained" onClick={() => handleSelectDSPs()} sx={buttonAddArtist} endIcon={<Edit />}>
                Editar DSPS
              </Button>
            </Grid>}

          <Grid container item xs={12}>
            <Grid item xs={showingNotBasicAlbumFields ? 6 : 12}>
              <TextFieldWithAddElement
                name="label_name"
                sx={showingNotBasicAlbumFields ? textFieldStyle : textFieldLaFlotaArtistStyle}
                required
                select
                label="Sello Discográfico"
                value={currentAlbumData.label_name}
                onChange={handlerLabelChoose}
                helperText="Selecciona el sello discográfico."
                selectItems={myLabels}
                selectKeyField="name"
                selectValueField="name"
                validatorProps={{ restrictions: 'required|max:50', message: "Debes seleccionar un sello para el Lanzamiento.", validator: validator }}
                onClickAddElement={() => setOpenAddLabel(true)}
                addPlaceholder="Crea un nuevo sello"
              />
            </Grid>

            {showingNotBasicAlbumFields && <Grid item xs={6}>
              <TextFieldWithInfo
                name="title"
                sx={textFieldStyle}
                required
                label="Título del Lanzamiento"
                value={currentAlbumData.title}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "title")}
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar el Título del Lanzamiento.", validator: validator }}
              />
            </Grid>}
          </Grid>

          {showingNotBasicAlbumFields && <Grid container item xs={12}>
            <Grid item xs={6}>
              <TextFieldWithInfoImage
                name="version"
                sx={textFieldStyle}
                label="Versión (Vivo, Acústico...)"
                value={currentAlbumData.version}
                helperText="Puedes especificar si el lanzamiento es una versión de otro lanzamiento. Por Ejemplo, una versión en Vivo o Acústica."
                onChange={event => handlerBasicUpdateAlbum(event.target.value, "version")}
                imageSource="/images/versionReleaseHelp.png"
                contentTexts={[["No debés escribir los paréntesis, se incluirán solos."]]}
              />
            </Grid>

            <Grid item xs={6}>
              <TextFieldWithInfo
                name="format"
                sx={textFieldStyle}
                select
                label="Formato del Lanzamiento"
                value={currentAlbumData.format}
                onChange={event => handlerBasicUpdateAlbum(event.target.value, "format")}
                helperText="Elige el formato del lanzamiento, segun la cantidad de canciones o la duración del Lanzamiento."
                selectItems={["Single", "EP", "Álbum"]}
              />
            </Grid>
          </Grid>}

        </Grid>

        {showingNotBasicAlbumFields && <Grid container item xs={12}>
          <Grid container item xs={6}>
            <Grid item xs={12}>
              <TextFieldWithInfo
                name="c_year"
                sx={textFieldStyle}
                required
                select
                label="(C) Año de Copyright"
                value={currentAlbumData.c_year}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "c_year")}
                helperText="Año en que esta grabación fue creada."
                selectItems={yearsArray}
                validatorProps={{
                  restrictions: 'required|numeric', message: "Debes seleccionar un año de Copyright del Lanzamiento.", validator,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldWithInfo
                name="c_line"
                sx={textFieldStyle}
                required
                label="Copyright"
                value={currentAlbumData.c_line}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "c_line")}
                helperText="El dueño de los Derechos de Autor.
              → Si tu lanzamiento contiene Covers debes agregar el nombre de los autores originales acá (Por ej.: Luis Alberto Spinetta)."
                validatorProps={{
                  restrictions: 'required|max:200', message: "Por favor indicá el dueño de los derechos de autor del lanzamiento.",
                  validator
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={6}>
            <Grid item xs={12}>
              <TextFieldWithInfo
                sx={textFieldStyle}
                name="p_year"
                required
                select
                label="(P) Año de Publishing"
                value={currentAlbumData.p_year}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "p_year")}
                helperText="Año en que esta grabación fue publicada."
                selectItems={yearsArray}
                validatorProps={{
                  restrictions: 'required|numeric', message: "Debes seleccionar un año de Publishing del Lanzamiento.",
                  validator
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldWithInfo
                name="p_line"
                sx={textFieldStyle}
                required
                label="Publisher"
                value={currentAlbumData.p_line}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "p_line")}
                helperText="El dueño de los Derechos de Publicación de esta grabación.
            → Ej. 1: Fito Paez | Ej. 2: Sony Music"
                validatorProps={{
                  restrictions: 'required|max:200', message: "Por favor indicá el publicador del lanzamiento.",
                  validator
                }}
              />
            </Grid>
          </Grid>

        </Grid>}

        {showingNotBasicAlbumFields && <Grid container item xs={12}>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="upc"
              sx={textFieldStyle}
              label="UPC"
              value={currentAlbumData.upc}
              helperText="Completa sólo si ya tienes un código UPC que quieras usar con este lanzamiento. Si no tienes le asignaremos uno."
              onChange={handlerUPC}
              validatorProps={{
                restrictions: 'min:13|max:13|numeric', message: "Formato inválido: El UPC es un código de 13 números",
                validator: validator
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="language"
              sx={textFieldStyle}
              required
              select
              label="Idioma Principal del Lanzamiento"
              value={currentAlbumData.languageName}
              onChange={handlerLanguageChoose}
              selectItems={languagesFuga}
              selectKeyField="id"
              selectValueField="name"
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="generosMusicales"
              sx={textFieldStyle}
              required
              select
              label="Género Musical Principal"
              value={currentAlbumData.genreName}
              onChange={handlerGenreChoose}
              selectItems={allFugaGenres}
              selectKeyField="id"
              selectValueField="name"
              validatorProps={{ restrictions: 'required', message: "Debés seleccionar el género principal del Lanzamiento.", validator }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithAddElement
              name="subgenerosMusicales"
              sx={textFieldStyle}
              select
              label="Género Musical Secundario"
              value={currentAlbumData.subgenreName}
              onChange={handlerSubgenreChoose}
              selectItems={currentUserData.subgenerosPropios || []}
              selectKeyField="id"
              selectValueField="name"
              onClickAddElement={() => setOpenAddSubgenre(true)}
              addPlaceholder="Crea tu propio subgénero"
            />
          </Grid>
        </Grid>}

        {showingNotBasicAlbumFields && <Grid container item xs={12} paddingTop={3} justifyContent="center">

          <TypographyWithInfo infoTooltip={releaseDateInfoTooltip} title="Fecha del Lanzamiento" />

          <SelectDateInputDDMMYYYY type="release-date" dayValue={currentAlbumData.dayOfMonth} monthValue={currentAlbumData.month} yearValue={currentAlbumData.year}
            setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "dayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "month")}
            setYear={event => handlerBasicUpdateAlbum(event.target.value, "year")} simpleValidator={validator} />

          <CheckboxWithInfo
            label="¿El Lanzamiento fue publicado en el pasado?"
            checked={currentAlbumData.oldRelease}
            onChecked={(event) => handlerBasicUpdateAlbum(event.target.checked, "oldRelease")}
            checkBoxHelper={oldReleaseCheckBoxHelper}
            color="#9c27b0"
          />

          {currentAlbumData.oldRelease &&
            <SelectDateInputDDMMYYYY type="old-release-date" dayValue={currentAlbumData.originalDayOfMonth} monthValue={currentAlbumData.originalMonth} yearValue={currentAlbumData.originalYear}
              setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "originalDayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "originalMonth")}
              setYear={event => handlerBasicUpdateAlbum(event.target.value, "originalYear")} simpleValidator={validator} />
          }

          <CheckboxWithInfo
            label="¿Permitir pre-comprar antes del lanzamiento?"
            checked={currentAlbumData.preOrder}
            onChecked={(event) => handlerBasicUpdateAlbum(event.target.checked, "preOrder")}
            checkBoxHelper={preSaleCheckBoxHelper}
            color="#9c27b0"
          />

          {currentAlbumData.preOrder &&
            <SelectDateInputDDMMYYYY type="preOrder" dayValue={currentAlbumData.preOrderDayOfMonth} monthValue={currentAlbumData.preOrderMonth} yearValue={currentAlbumData.preOrderYear}
              setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "preOrderDayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "preOrderMonth")}
              setYear={event => handlerBasicUpdateAlbum(event.target.value, "preOrderYear")} simpleValidator={validator} />
          }
          {currentAlbumData.preOrder &&
            <CheckboxWithInfo
              label="Habilitar pre-escucha para la pre-compra"
              checked={currentAlbumData.preview}
              onChecked={event => handlerBasicUpdateAlbum(event.target.checked, "preview")}
              color="#9c27b0"
              checkBoxHelper="Permitir que los usuarios escuchen un fragmento (30 segundos) de las canciones durante la etapa de Pre-Compra."
            />
          }

        </Grid>}

        {showingNotBasicAlbumFields &&
          <Grid container item xs={12} paddingTop={4} justifyContent="center">
            <Grid item xs={8} >
              <TracksTable tracksTableData={tracksDataTable} handleClickAddTrack={handleClickAddTrack} />
            </Grid>
          </Grid>}

        <Grid item xs={12}>
          <NewTrackDialog openDialog={openNewTrackDialog} setOpenNewTrackDialog={setOpenNewTrackDialog} setTracksDataTable={setTracksDataTable}
            tracksDataTable={tracksDataTable} trackData={trackData} setTrackData={setTrackData} circularProgress={(progress) => trackUploadProgress(progress)} />
        </Grid>

        <Grid item xs={12} paddingTop={4}>
          <CardFooter style={{ display: 'inline-flex' }}>
            {(needArtistLabelCoverAndContinue && currentAlbumData.basicFieldsComplete) || openLoader
              ? <ProgressButton
                textButton={buttonText}
                loading={openLoader}
                buttonState={buttonState}
                onClickHandler={allFieldsValidCreateAlbum}
                // onClickHandler={testingNewRelease}
                noneIcon={<Save sx={{ color: "rgba(255,255,255, 1)" }} />}
                noFab={false} />
              : <Button onClick={coverLabelArtistAllValids}>
                Continuar
              </Button>
            }
          </CardFooter>
        </Grid>
      </Card >

    </Grid >
  )
}

export default NewAlbum;

const textFieldStyle = { width: "60%" };
const textFieldLaFlotaArtistStyle = { width: "40%" };

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

const buttonAddArtist = { marginTop: "2%", backgroundColor: "#9c27b0", '&:hover': { backgroundColor: "#9c27b0" } }
