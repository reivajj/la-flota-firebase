import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { Grid } from '@material-ui/core';
import Table from "components/Table/Table";
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';

const styles = {
  tableCard: {
    display: "inline-flex",
    width: "60%"
  }
};

const useStyles = makeStyles(styles);

const TracksTable = ({tracksTableData}) => {
  const classes = useStyles();

  return (
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
            tableHead={["Nº Track", "Título", "ISRC", "Artistas Invitados", "Es un Cover?", "Lenguaje", "Lenguaje inapropiado?", "Acciones", "Carga"]}
            tableData={tracksTableData}
          />
        </CardBody>
      </Card>
    </Grid>
  );
}

export default TracksTable;
