import React from "react";
// core components
import { Grid, Card } from '@mui/material';
import Table from "components/Table/Table";


const TracksTableInAlbumInfo = ({ tracksTableData }) => {
  return (
    <Grid container item xs={12}>
      <Card sx={{ width: "100%" }}>

        <Table
          tableHeaderColor="primary"
          tableHead={["N°", "Nombre", "ISRC", "Artistas"]}
          tableData={tracksTableData}
        />

      </Card>
    </Grid>
  );
}

export default TracksTableInAlbumInfo;
