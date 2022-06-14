import React, { useState, useEffect } from "react";
import { Grid, Backdrop, CircularProgress, Typography, Skeleton, Box } from '@mui/material';

import { needAdminPermissionsText } from '../../utils/textToShow.utils';
import InfoDialog from 'components/Dialogs/InfoDialog';
import SearchNavbar from "components/Navbars/SearchNavbar";
import CustomizedTable from "components/Table/CustomizedTable";
import { getRoyaltyHeadersForUser, getSkeletonRoyaltiesRow } from "factory/royalties.factory";
import { getRoyaltiesForTableView } from '../../services/BackendCommunication';
import { useDispatch, useSelector } from 'react-redux';
import { createRoyaltyRowForUser } from '../../factory/royalties.factory';
import { userIsAdmin } from 'utils/users.utils';

const Royalties = () => {
  const dispatch = useDispatch();
  const albums = useSelector(store => store.albums.albums);
  const currentUserData = useSelector(store => store.userData);
  const rol = currentUserData.rol;

  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [royaltiesRows, setRoyaltiesRows] = useState([]);
  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getRoyaltiesCountAndRows = async () => {
      setSearching(true);
      setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
      let { count, rows } = await getRoyaltiesForTableView("upc", [], "fuga", rowsPerPage, rowsPerPage * page, dispatch);
      console.log({ count, rows });
      setTotalCount(count);
      setRoyaltiesRows(rows.map(royaltyRow => createRoyaltyRowForUser(royaltyRow)));
      setSearching(false);
    }

    getRoyaltiesCountAndRows();
  }, [page, rowsPerPage])

  const headers = getRoyaltyHeadersForUser;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let royaltiesTableParams = { rows: royaltiesRows, headers, totalCount, handleChangePage, page, handleChangeRowsPerPage, rowsPerPage };

  return userIsAdmin(rol)
    ? (
      <>
        <Backdrop open={false}>
          <CircularProgress />
        </Backdrop>

        <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
          title={"Necesitas permisos de Administrador"} contentTexts={needAdminPermissionsText} />

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography sx={artistsTitleStyles}>Regalías</Typography>

          <Grid item xs={12} padding={2} >
            <SearchNavbar searchArrayProps={[]} cleanSearchResults={() => console.log()} />
          </Grid>

          <Grid item xs={11} sx={{ margin: 'auto' }}>
            <CustomizedTable {...royaltiesTableParams} />
          </Grid>

        </Grid>

      </>
    ) : <p>No tienes los permisos suficientes para ver ésta página</p>;
}

const artistsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }

export default Royalties;