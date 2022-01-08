import React from "react";
// core components
import { Grid, Typography, Button } from '@mui/material';
import Table from "components/Table/Table";
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from "components/Card/CardFooter";

import { AddCircleOutline } from '@mui/icons-material/';

const TracksTable = ({ tracksTableData, handleClickAddTrack }) => {
  return (
    <Grid item xs={12}>
      <Card style={cardStyle}>
        <CardHeader color="primary" style={{ width: "70em" }}>
          <Typography sx={cardTitleWhiteStyles}>Canciones</Typography>
          <p sx={cardCategoryWhiteStyles}>Agrega las Canciones del Lanzamiento</p>
        </CardHeader>
        <CardBody>
          <Table
            tableHeaderColor="primary"
            tableHead={["Nº Track", "Título", "ISRC", "Artistas Invitados", "Es un Cover?", "Lenguaje", "Lenguaje inapropiado?", "Acciones", "Carga"]}
            tableData={tracksTableData}
          />
        </CardBody>

        <CardFooter>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleClickAddTrack}
              color="primary"
              endIcon={<AddCircleOutline />}
            >
              Agregar Canción
            </Button>
          </Grid>
        </CardFooter>

      </Card>
    </Grid>
  );
}

export default TracksTable;

const cardStyle = {
  alignItems: "center",
  backgroundColor: "cornsilk"
}

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
  fontSize: "30px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}