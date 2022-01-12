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
    <Grid container item xs={12}>
      <Card style={cardStyle}>

          <CardHeader color="primary" style={{width: "60%"}}>
            <Typography sx={cardTitleWhiteStyles}>Canciones</Typography>
          </CardHeader>

        <CardBody style={{width: "90%"}}>
          <Table
            tableHeaderColor="primary"
            tableHead={["Nº Track", "Título", "ISRC", "Artistas Invitados", "Lenguaje", "Explicito", "Acciones", "Carga"]}
            tableData={tracksTableData}
          />
        </CardBody>

        <CardFooter style={{width: "25%"}}>
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
  backgroundColor: "cornsilk",
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