import React from "react";
// core components
import { Grid, Typography, Button } from '@mui/material';
import Table from "components/Table/Table";
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from "components/Card/CardFooter";

import { AddCircleOutline } from '@mui/icons-material/';

const TableWithHeader = ({ titleTable, tableElements, tableHeaders, buttonText, handleButtonClick, backgroundColor, tableWidth, tableHeight }) => {

  const cardStyle = { alignItems: "center", backgroundColor };

  return (
    <Grid container item xs={12}>
      <Card style={cardStyle}>

        <CardHeader color="primary" style={{ width: "60%", height: "40%", textAlign: "center" }}>
          <Typography sx={cardTitleWhiteStyles}>{titleTable}</Typography>
        </CardHeader>

        <CardBody style={{ width: tableWidth }}>
          <Table
            tableHeaderColor="primary"
            tableHead={tableHeaders}
            tableData={tableElements}
            tableContainerSx={{ maxHeight: tableHeight, minHeight: 200 }}
          />
        </CardBody>

        {buttonText && <CardFooter >
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleButtonClick}
              sx={addTrackButtonStyles}
              endIcon={<AddCircleOutline />}
            >
              {buttonText}
            </Button>
          </Grid>
        </CardFooter>}

      </Card>
    </Grid>
  );
}

export default TableWithHeader;

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

const addTrackButtonStyles = { backgroundColor: "#9c27b0", '&:hover': { backgroundColor: "#9c27b0" } }