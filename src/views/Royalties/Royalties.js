import React, { useState, useEffect } from "react";
import { Grid, Backdrop, CircularProgress } from '@mui/material';

import { needAdminPermissionsText } from '../../utils/textToShow.utils';
import InfoDialog from 'components/Dialogs/InfoDialog';
import SearchNavbar from "components/Navbars/SearchNavbar";
import CustomizedTable from "components/Table/CustomizedTable";
import { createAccountingRowForUser, getAccountingHeadersForUser, getRoyaltyHeadersForUser, getSkeletonAccountingRow, getSkeletonRoyaltiesRow, getTotalesAccountingRow } from "factory/royalties.factory";
import { getRoyaltiesForTableView, getAccountingGroupedByForTableView } from '../../services/BackendCommunication';
import { useDispatch, useSelector } from 'react-redux';
import { createRoyaltyRowForUser } from '../../factory/royalties.factory';
import { userIsAdmin } from 'utils/users.utils';
import { whiteColor } from 'assets/jss/material-dashboard-react.js';
import { fugaGreen } from 'variables/colors';
import { toWithOutError } from 'utils';
import { getAlbumsByFieldRedux } from 'redux/actions/AlbumsActions';
import AccountingBar from "components/Navbars/AccountingBar";

const Royalties = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(store => store.userData);
  const rol = currentUserData.rol;

  // INIT SEARCH STUFF
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  const [isrcSearchValue, setIsrcSearchValue] = useState("");
  const [artistSearchValue, setArtistSearchValue] = useState("");
  // END SEARCH STUFF

  const [totalCount, setTotalCount] = useState(0);
  const [royaltiesRows, setRoyaltiesRows] = useState([]);
  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchParams, setSearchParams] = useState({ field: "upc", values: [] });
  const [royaltiesTableIsOpen, setRoyaltiesTableIsOpen] = useState(false);

  const [accountingRows, setAccountingRows] = useState(getSkeletonAccountingRow(6))
  const [filterAccountingParams, setFilterAccountingParams] = useState({ field: "upc", values: [], groupBy: "dsp" });
  const [accountingTableIsOpen, setAccountingTableIsOpen] = useState(true);

  // Royalties
  useEffect(() => {
    const getRoyaltiesCountAndRows = async () => {
      let { count, rows } = await getRoyaltiesForTableView(searchParams.field, searchParams.values, "fuga", rowsPerPage, rowsPerPage * page, dispatch);
      console.log({ count, rows });
      setTotalCount(count);
      setRoyaltiesRows(rows.map(royaltyRow => createRoyaltyRowForUser(royaltyRow)));
    }

    getRoyaltiesCountAndRows();
  }, [page, rowsPerPage, searchParams])

  // Accounting
  useEffect(() => {
    const getAccountingInfo = async () => {
      let accountingValues = await getAccountingGroupedByForTableView(filterAccountingParams.groupBy,
        filterAccountingParams.field, filterAccountingParams.values, dispatch);

      let totals = getTotalesAccountingRow(accountingValues);
      console.log("TOTALS: ", totals)
      setAccountingRows([totals, ...accountingValues.map(accountingRow => createAccountingRowForUser(accountingRow, "dsp"))]);
    }

    getAccountingInfo();
  }, [])

  const handleCollapseAccounting = () => setAccountingTableIsOpen(!accountingTableIsOpen);
  const handleCollapseRoyalties = () => setRoyaltiesTableIsOpen(!royaltiesTableIsOpen);

  const headersRoyaltiesName = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.name);
  const headersRoytaltiesWidth = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.width);
  const headersAccountingName = getAccountingHeadersForUser.map(headerWithWidth => headerWithWidth.name);
  const headersAccountingWidth = getAccountingHeadersForUser.map(headerWithWidth => headerWithWidth.width);

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
    rows: royaltiesRows, headers: headersRoyaltiesName, columnsWidth: headersRoytaltiesWidth,
    totalCount, handleChangePage, page, handleChangeRowsPerPage, rowsPerPage,
    headersHeight: 65, maxLengthChars: 17, maxWidthText: 150, rowsAlign: 'center',
    rowsHeight: 60
  };

  let accountingTableParams = {
    rows: accountingRows, headers: headersAccountingName, columnsWidth: headersAccountingWidth,
    totalCount: 0, headersHeight: 45, rowsHeight: 30, maxLengthChars: 60, maxWidthText: 300,
    rowsAlign: 'left'
  };

  // INIT SEARCH STUFF
  const onSearchEmailHandler = async email => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    if (!email) { setSearchParams({ field: "upc", values: [] }); return };
    let userAlbums = await toWithOutError(dispatch(getAlbumsByFieldRedux('ownerEmail', email)));
    setSearchParams({ field: "upc", values: userAlbums.map(albumFromEmail => albumFromEmail.upc) });
  }

  const onSearchArtistHandler = async artistName => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    if (!artistName) { setSearchParams({ field: "upc", values: [] }); return };
    setSearchParams({ field: "releaseArtist", values: artistName.trim() });
  }

  const onSearchUPCHandler = async upcsSeparatedByComa => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    let upcsAsArray = upcsSeparatedByComa.toString().split(",");
    setSearchParams({ field: "upc", values: upcsAsArray });
  }

  const onSearchISRCHandler = async isrcsSeparatedByComa => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    let isrcsAsArray = isrcsSeparatedByComa.toString().split(",");
    setSearchParams({ field: "isrc", values: isrcsAsArray });
  }

  const handleEnterKeyPress = (event, searchProps) => {
    if (event.key === 'Enter') {
      if (searchProps.name === "Email") onSearchEmailHandler(searchProps.value);
      if (searchProps.name === "UPC's separados por coma") onSearchUPCHandler(searchProps.value);
      if (searchProps.name === "ISRC's separados por coma") onSearchISRCHandler(searchProps.value);
      if (searchProps.name === "Nombre de Artista") onSearchArtistHandler(searchProps.value);
    }
  }

  const emailSearchProps = { name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailSearchValue.trim(), setValue: setEmailSearchValue };
  const upcSearchProps = { name: "UPC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchUPCHandler, value: upcSearchValue.trim(), setValue: setUpcSearchValue };
  const isrcSearchProps = { name: "ISRC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchISRCHandler, value: isrcSearchValue.trim(), setValue: setIsrcSearchValue };
  const artistSearchProps = { name: "Nombre de Artista", handleEnterKeyPress, onSearchHandler: onSearchArtistHandler, value: artistSearchValue, setValue: setArtistSearchValue };

  const cleanSearchResults = () => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage > 7 ? rowsPerPage : 7));
    setSearchParams({ field: "upc", values: [] });
    setEmailSearchValue(""); setUpcSearchValue(""); setIsrcSearchValue("");
    setArtistSearchValue("");
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
            <AccountingBar searchArrayProps={[emailSearchProps]} total={0} appBarSx={appBarSx} appBarTitle='Ganancias' mainSearchColor={fugaGreen}
              isOpen={accountingTableIsOpen} handleCollapseTable={handleCollapseAccounting} />
          </Grid>

          {accountingTableIsOpen && <Grid item xs={12} paddingBottom={2} sx={{ margin: 'auto' }}>
            <CustomizedTable {...accountingTableParams} />
          </Grid>}

          <Grid item xs={12} paddingTop={2} >
            <SearchNavbar searchArrayProps={[emailSearchProps, upcSearchProps, isrcSearchProps, artistSearchProps]}
              cleanSearchResults={cleanSearchResults} appBarSx={appBarSx} appBarTitle='Regalías' mainSearchColor={fugaGreen}
              isOpen={royaltiesTableIsOpen} handleCollapseTable={handleCollapseRoyalties} />
          </Grid>

          {royaltiesTableIsOpen && <Grid item xs={12} sx={{ margin: 'auto' }}>
            <CustomizedTable {...royaltiesTableParams} />
          </Grid>}

        </Grid>

      </>
    ) : <p>No tienes los permisos suficientes para ver ésta página</p>;
}

export default Royalties;