import React, { useState, useEffect } from "react";
import { Grid, Backdrop, CircularProgress } from '@mui/material';

import { needAdminPermissionsText } from '../../utils/textToShow.utils';
import InfoDialog from 'components/Dialogs/InfoDialog';
import SearchNavbar from "components/Navbars/SearchNavbar";
import CustomizedTable from "components/Table/CustomizedTable";
import { getRoyaltyHeadersForUser, getSkeletonRoyaltiesRow } from "factory/royalties.factory";
import { getRoyaltiesForTableView } from '../../services/BackendCommunication';
import { useDispatch, useSelector } from 'react-redux';
import { createRoyaltyRowForUser } from '../../factory/royalties.factory';
import { userIsAdmin } from 'utils/users.utils';
import { whiteColor } from 'assets/jss/material-dashboard-react.js';
import { fugaGreen } from 'variables/colors';
import { toWithOutError } from 'utils';
import { getAlbumsByFieldRedux } from 'redux/actions/AlbumsActions';

const Royalties = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(store => store.userData);
  const rol = currentUserData.rol;

  // INIT SEARCH STUFF
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  // END SEARCH STUFF

  const [totalCount, setTotalCount] = useState(0);
  const [royaltiesRows, setRoyaltiesRows] = useState([]);
  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchParams, setSearchParams] = useState({ field: "upc", values: [] });

  useEffect(() => {
    const getRoyaltiesCountAndRows = async () => {
      let { count, rows } = await getRoyaltiesForTableView(searchParams.field, searchParams.values, "fuga", rowsPerPage, rowsPerPage * page, dispatch);
      console.log({ count, rows });
      setTotalCount(count);
      setRoyaltiesRows(rows.map(royaltyRow => createRoyaltyRowForUser(royaltyRow)));
    }

    getRoyaltiesCountAndRows();
  }, [page, rowsPerPage, searchParams])

  const headersName = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.name);
  const headersWidth = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.width);

  const handleChangePage = (event, newPage) => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let appBarSx = { borderRadius: '0em', backgroundColor: whiteColor };
  let royaltiesTableParams = {
    rows: royaltiesRows, headers: headersName, columnsWidth: headersWidth,
    totalCount, handleChangePage, page, handleChangeRowsPerPage, rowsPerPage,
    headersHeight: 65
  };

  // INIT SEARCH STUFF
  const onSearchEmailHandler = async email => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    if (!email) { setSearchParams({ field: "upc", values: [] }); return }
    let userAlbums = await toWithOutError(dispatch(getAlbumsByFieldRedux('ownerEmail', email)));
    setSearchParams({ field: "upc", values: userAlbums.map(albumFromEmail => albumFromEmail.upc) });
  }

  const onSearchUPCHandler = async upcsSeparatedByComa => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    let upcsAsArray = upcsSeparatedByComa.toString().split(",");
    setSearchParams({ field: "upc", values: upcsAsArray });
  }

  const handleEnterKeyPress = (event, searchProps) => {
    if (event.key === 'Enter') {
      if (searchProps.name === "Email") onSearchEmailHandler(searchProps.value);
      if (searchProps.name === "UPC") onSearchUPCHandler(searchProps.value);
    }
  }

  const emailSearchProps = { name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailSearchValue.trim(), setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC", handleEnterKeyPress, onSearchHandler: onSearchUPCHandler, value: upcSearchValue.trim(), setValue: setUpcSearchValue };

  const cleanSearchResults = () => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    setSearchParams({ field: "upc", values: [] });
    setEmailSearchValue("");
    setUpcSearchValue("");
  }
  // END SEARCH STUFF

  return userIsAdmin(rol)
    ? (
      <>
        <Backdrop open={false}>
          <CircularProgress />
        </Backdrop>

        <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
          title={"Necesitas permisos de Administrador"} contentTexts={needAdminPermissionsText} />

        <Grid item xs={12} sx={{ textAlign: "center" }}>

          <Grid item xs={12} padding={0} >
            <SearchNavbar searchArrayProps={[emailSearchProps, upcSearchProps]} cleanSearchResults={cleanSearchResults} appBarSx={appBarSx}
              appBarTitle='Regalías' mainSearchColor={fugaGreen} />
          </Grid>

          <Grid item xs={12} sx={{ margin: 'auto' }}>
            <CustomizedTable {...royaltiesTableParams} />
          </Grid>

        </Grid>

      </>
    ) : <p>No tienes los permisos suficientes para ver ésta página</p>;
}

export default Royalties;