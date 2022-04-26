import React from "react";
// core components
import { Card } from '@mui/material';
import Table from "components/Table/Table";


const TracksTableInAlbumInfo = ({ tracksTableData, sxCard }) => {
  return (
    <Card sx={sxCard}>

      <Table
        tableHeaderColor="primary"
        tableHead={["N°", "Nombre", "ISRC", "Artistas", "Duración (mm:ss)"]}
        tableData={tracksTableData}
      />

    </Card>
  );
}

export default TracksTableInAlbumInfo;
