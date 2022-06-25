import React, { useState, useEffect } from "react";
import { Grid, Backdrop, CircularProgress } from '@mui/material';

import { resourceNotYoursText, waitForRoyalties } from '../../utils/textToShow.utils';
import InfoDialog from 'components/Dialogs/InfoDialog';
import SearchNavbar from "components/Navbars/SearchNavbar";
import CustomizedTable from "components/Table/CustomizedTable";
import { accountingGroupByValues, createAccountingRowForUser, getAccountingHeadersForUser, getRoyaltyHeadersForUser, getSkeletonAccountingRow, getSkeletonRoyaltiesRow, getTotalesAccountingRow, groupByNameToId } from "factory/royalties.factory";
import { getRoyaltiesForTableView, getAccountingGroupedByForTableView } from '../../services/BackendCommunication';
import { useDispatch, useSelector } from 'react-redux';
import { createRoyaltyRowForUser } from '../../factory/royalties.factory';
import { userIsAdmin } from 'utils/users.utils';
import { whiteColor } from 'assets/jss/material-dashboard-react.js';
import { fugaGreen } from 'variables/colors';
import { toWithOutError } from 'utils';
import { getAlbumsByFieldRedux } from 'redux/actions/AlbumsActions';
import AccountingBar from "components/Navbars/AccountingBar";
import WaitingDialog from "components/Dialogs/WaitingDialog";

const Royalties = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(store => store.userData);
  const albums = useSelector(store => store.albums.albums);
  const artists = useSelector(store => store.artists.artists);
  const rol = currentUserData.rol;

  const isAdmin = userIsAdmin(rol);
  const albumsUpc = albums.map(album => album.upc.toString());
  const artistsNames = artists.map(artist => artist.name); 

  // INIT SEARCH STUFF
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [upcSearchValue, setUpcSearchValue] = useState("");
  const [isrcSearchValue, setIsrcSearchValue] = useState("");
  const [artistSearchValue, setArtistSearchValue] = useState("");

  const [emailAccSearchValue, setEmailAccSearchValue] = useState("");
  const [upcAccSearchValue, setUpcAccSearchValue] = useState("");
  const [isrcAccSearchValue, setIsrcAccSearchValue] = useState("");
  const [artistAccSearchValue, setArtistAccSearchValue] = useState("");
  // END SEARCH STUFF

  const [loadingRoyalties, setLoadingRoyalties] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [royaltiesRows, setRoyaltiesRows] = useState([]);
  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchParams, setSearchParams] = useState({ field: "upc", values: isAdmin ? [] : albumsUpc });
  const [royaltiesTableIsOpen, setRoyaltiesTableIsOpen] = useState(false);

  const getAccInitParams = () => {
    return isAdmin
      ? { field: "upc", values: [], groupBy: { id: 'dsp', name: "DSP's" } }
      : { field: "releaseArtist", values: artistsNames, groupBy: { id: 'dsp', name: "DSP's" } }
  }

  const [accountingRows, setAccountingRows] = useState(getSkeletonAccountingRow(10));
  const [filterAccountingParams, setFilterAccountingParams] = useState(getAccInitParams());
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
      setLoadingRoyalties(true);
      let { groupBy, field, values } = filterAccountingParams;
      let accountingValues = await getAccountingGroupedByForTableView(groupBy.id, field, values, dispatch);
      let totals = getTotalesAccountingRow(accountingValues);
      setAccountingRows([totals, ...accountingValues.map(accountingRow => createAccountingRowForUser(accountingRow, groupBy)).slice(0, 50)]);
      setLoadingRoyalties(false);
    }

    getAccountingInfo();
  }, [filterAccountingParams])

  const handleCollapseAccounting = () => setAccountingTableIsOpen(!accountingTableIsOpen);
  const handleCollapseRoyalties = () => setRoyaltiesTableIsOpen(!royaltiesTableIsOpen);

  const headersRoyaltiesName = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.name);
  const headersRoytaltiesWidth = getRoyaltyHeadersForUser.map(headerWithWidth => headerWithWidth.width);
  const headersAccountingName = getAccountingHeadersForUser(filterAccountingParams.groupBy).map(headerWithWidth => headerWithWidth.name);
  const headersAccountingWidth = getAccountingHeadersForUser(filterAccountingParams.groupBy).map(headerWithWidth => headerWithWidth.width);

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

  const setSkeletonRows = caller => {
    if (caller === "royalties") setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage));
    if (caller === "accounting") setAccountingRows(getSkeletonAccountingRow(accountingRows.length));
  }

  const onSearchEmailHandler = async (email, caller) => {
    setSkeletonRows(caller);
    if (!email) { setSearchParams({ field: "upc", values: isAdmin ? [] : albumsUpc }); return };
    let userAlbums = isAdmin
      ? await toWithOutError(dispatch(getAlbumsByFieldRedux('ownerEmail', email, 1000)))
      : albumsUpc;
    if (caller === "royalties") setSearchParams({ field: "upc", values: userAlbums.map(albumFromEmail => albumFromEmail.upc) });
    if (caller === "accounting") setFilterAccountingParams({ ...filterAccountingParams, field: "upc", values: userAlbums.map(albumFromEmail => albumFromEmail.upc) })
  }

  const onSearchArtistHandler = async (artistName, caller) => {
    if (!isAdmin && !artists.map(artist => artist.name).includes(artistName.trim())) {
      setSearchParams({ field: "upc", values: isAdmin ? [] : albumsUpc });
      setOpenNotAdminWarning(true);
      return;
    }
    setSkeletonRows(caller);
    if (!artistName) { setSearchParams({ field: "upc", values: isAdmin ? [] : albumsUpc }); return };
    if (caller === "royalties") setSearchParams({ field: "releaseArtist", values: artistName.trim() });
    if (caller === "accounting") setFilterAccountingParams({ ...filterAccountingParams, field: "releaseArtist", values: artistName.trim() });
  }

  const onSearchUPCHandler = async (upcsSeparatedByComa, caller) => {
    let upcsAsArray = upcsSeparatedByComa.toString().split(",");

    if (!isAdmin) {
      let includesAllUpcs = upcsAsArray.every(upc => albumsUpc.indexOf(upc) > -1);
      if (!includesAllUpcs) {
        setSearchParams({ field: "upc", values: isAdmin ? [] : albumsUpc });
        setOpenNotAdminWarning(true);
        return;
      }
    }
    setSkeletonRows(caller);
    if (caller === "royalties") setSearchParams({ field: "upc", values: upcsAsArray });
    if (caller === "accounting") setFilterAccountingParams({ ...filterAccountingParams, field: "upc", values: upcsAsArray });
  }

  const onSearchISRCHandler = async (isrcsSeparatedByComa, caller) => {
    setSkeletonRows(caller);
    let isrcsAsArray = isrcsSeparatedByComa.toString().split(",");
    if (caller === "royalties") setSearchParams({ field: "isrc", values: isrcsAsArray });
    if (caller === "accounting") setFilterAccountingParams({ ...filterAccountingParams, field: "isrc", values: isrcsAsArray });
  }

  const handleEnterKeyPress = (event, searchProps, caller) => {
    if (event.key === 'Enter') {
      if (searchProps.name === "Email") onSearchEmailHandler(searchProps.value, caller);
      if (searchProps.name === "UPC's separados por coma") onSearchUPCHandler(searchProps.value, caller);
      if (searchProps.name === "ISRC's separados por coma") onSearchISRCHandler(searchProps.value, caller);
      if (searchProps.name === "Artista") onSearchArtistHandler(searchProps.value, caller);
    }
  }

  const emailSearchProps = { shortName: "Email", name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailSearchValue.trim(), setValue: setEmailSearchValue };
  const upcSearchProps = { shortName: "UPC's", name: "UPC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchUPCHandler, value: upcSearchValue.trim(), setValue: setUpcSearchValue };
  const isrcSearchProps = { shortName: "ISRC's", name: "ISRC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchISRCHandler, value: isrcSearchValue.trim(), setValue: setIsrcSearchValue };
  const artistSearchProps = { shortName: "Artista", name: "Artista", handleEnterKeyPress, onSearchHandler: onSearchArtistHandler, value: artistSearchValue, setValue: setArtistSearchValue };

  const emailAccSearchProps = { shortName: "Email", name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailAccSearchValue.trim(), setValue: setEmailAccSearchValue };
  const upcAccSearchProps = { shortName: "UPC's", name: "UPC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchUPCHandler, value: upcAccSearchValue.trim(), setValue: setUpcAccSearchValue };
  const isrcAccSearchProps = { shortName: "ISRC's", name: "ISRC's separados por coma", handleEnterKeyPress, onSearchHandler: onSearchISRCHandler, value: isrcAccSearchValue.trim(), setValue: setIsrcAccSearchValue };
  const artistAccSearchProps = { shortName: "Artista", name: "Artista", handleEnterKeyPress, onSearchHandler: onSearchArtistHandler, value: artistAccSearchValue, setValue: setArtistAccSearchValue };

  const handleChangeGroupBy = groupByName => {
    console.log(groupByName);
    setAccountingRows(getSkeletonAccountingRow(accountingRows.length > 10 ? accountingRows.length : 10));
    setFilterAccountingParams({ ...filterAccountingParams, groupBy: { id: groupByNameToId(groupByName), name: groupByName || "DSP's" } })
  }

  const groupByProps = { helper: "Agrupar según", values: accountingGroupByValues, handleChangeGroupBy, value: filterAccountingParams.groupBy }

  const cleanRoyaltiesParams = () => {
    setRoyaltiesRows(getSkeletonRoyaltiesRow(rowsPerPage > 7 ? rowsPerPage : 7));
    setSearchParams({ field: "upc", values: isAdmin ? [] : albumsUpc });
    setEmailSearchValue(""); setUpcSearchValue(""); setIsrcSearchValue("");
    setArtistSearchValue("");
  }

  const cleanAccountingParams = () => {
    setAccountingRows(getSkeletonAccountingRow(accountingRows.length > 10 ? accountingRows.length : 10));
    setFilterAccountingParams({ groupBy: { id: "dsp", name: "DSP's" }, field: "upc", values: isAdmin ? [] : albumsUpc });
    setEmailAccSearchValue(""); setUpcAccSearchValue(""); setIsrcAccSearchValue("");
    setArtistAccSearchValue("");
  }

  const cleanSearchResults = caller => {
    if (caller === "royalties") cleanRoyaltiesParams();
    if (caller === "accounting") cleanAccountingParams();
  }
  // END SEARCH STUFF

  const buscadoresAccounting = isAdmin
    ? [emailAccSearchProps, upcAccSearchProps, isrcAccSearchProps, artistAccSearchProps]
    : [artistAccSearchProps]

  const buscadoresRoyalties = isAdmin
    ? [emailSearchProps, upcSearchProps, isrcSearchProps, artistSearchProps]
    : [artistSearchProps]

  const handleCloserWaitingRoyalties = () => {
    setLoadingRoyalties(false);
  }

  return true
    ? (
      <>
        <Backdrop open={false}>
          <CircularProgress />
        </Backdrop>

        <WaitingDialog isOpen={loadingRoyalties} title="Cargando Regalías" contentTexts={waitForRoyalties}
          handleClose={handleCloserWaitingRoyalties} successImageSource="/images/success.jpg" size="sm" />

        <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
          title={"Necesitas permisos de Administrador"} contentTexts={resourceNotYoursText} />

        <Grid item xs={12} sx={{ textAlign: "center" }}>

          <Grid item xs={12} padding={0} >
            <AccountingBar searchArrayProps={buscadoresAccounting} cleanSearchResults={cleanSearchResults}
              appBarSx={appBarSx} appBarTitle='Ingresos' mainSearchColor={fugaGreen} isOpen={accountingTableIsOpen}
              handleCollapseTable={handleCollapseAccounting} groupByProps={groupByProps} />
          </Grid>

          {accountingTableIsOpen && <Grid item xs={12} paddingBottom={2} sx={{ margin: 'auto' }}>
            <CustomizedTable {...accountingTableParams} />
          </Grid>}

          <Grid item xs={12} paddingTop={2} >
            <SearchNavbar searchArrayProps={buscadoresRoyalties} cleanSearchResults={cleanSearchResults}
              appBarSx={appBarSx} appBarTitle='Regalías' mainSearchColor={fugaGreen}
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