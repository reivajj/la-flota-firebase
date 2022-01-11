import React, { useState, useRef } from "react";
// import InputLabel from "@mui/material/InputLabel";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import SimpleReactValidator from "simple-react-validator";
import { TextField, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createLabelRedux } from '../../redux/actions/LabelsActions';
import { errorFormat, toWithOutError, useForceUpdate } from "utils";
import ProgressButton from 'components/CustomButtons/ProgressButton';
import SaveIcon from '@mui/icons-material/Save';

const NewLabel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const allFieldsValidCreateLabel = () => {
    if (simpleValidator.current.allValid()) {
      createLabel();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createLabel = async () => {
    setOpenLoader(true);
    let result = await toWithOutError(dispatch(createLabelRedux({ name, details, }, currentUserId)));
    if (result === "SUCCESS") navigate('/admin/labels');
    else {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Sello</Typography>
            <p sx={cardCategoryWhiteStyles}>Completa con los datos del Sello. Luego no podrá ser editado.</p>
          </CardHeader>

          <CardBody>
            <Grid item xs={12} sx={{ paddingTop: "2em" }}>
              <TextField
                name="nombre"
                required
                fullWidth
                id="nombre"
                label="Nombre del Sello"
                autoFocus
                value={name}
                onChange={evento => setName(evento.target.value)}
              />
              {simpleValidator.current.message('nombre', name, 'required', {
                className: 'text-danger',
                messages: { default: "Debes ingresar un nombre." },
                element: (message) => errorFormat(message)
              })}
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="normal"
                id="details"
                name="details"
                label="Breve Descripción del Sello (max 100 caracteres, opcional)"
                fullWidth
                value={details}
                multiline={true}
                inputProps={{ maxLength: 100 }}
                maxRows="3"
                onChange={(evento) => setDetails(evento.target.value)} />
            </Grid>
          </CardBody>

          <CardFooter>
            <Grid justifyContent="center" textAlign="center" container >
              <ProgressButton
                textButton={buttonText}
                loading={openLoader}
                buttonState={buttonState}
                onClickHandler={allFieldsValidCreateLabel}
                noneIcon={<SaveIcon sx={{ color: "rgba(255,255,255, 1)" }} />}
                noFab={false} />
            </Grid>
          </CardFooter>
        </Card>
      </Grid>
    </Grid>
  );
}

export default NewLabel;

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