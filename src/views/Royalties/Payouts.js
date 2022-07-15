import React, { useState, useEffect } from "react";
import { Grid, Backdrop, CircularProgress, Button } from '@mui/material';

import { resourceNotYoursText, emptyPaysResult, waitForPayouts } from '../../utils/textToShow.utils';
import InfoDialog from 'components/Dialogs/InfoDialog';
import SearchNavbar from "components/Navbars/SearchNavbar";
import CustomizedTable from "components/Table/CustomizedTable";

import { useDispatch, useSelector } from 'react-redux';
import { userIsAdmin } from 'utils/users.utils';
import { whiteColor } from 'assets/jss/material-dashboard-react.js';
import { fugaGreen } from 'variables/colors';
import AccountingBar from "components/Navbars/AccountingBar";
import WaitingDialog from "components/Dialogs/WaitingDialog";
import { solicitarRegaliasUrl } from "variables/urls";
import { Paid } from '@mui/icons-material';
import {
  createPayoutRowForUser, getSkeletonWdAccountingRow, getSkeletonPayoutRow, getPayoutAccountingRows,
  getTotalsPayoutsAccountingRow, getWdAccountingHeadersForUser, payoutsGroupByValues, getPayoutsHeadersForAdmin,
  getPayoutsHeadersForUser, createPayoutRowForAdmin
} from "factory/payouts.factory";
import { getPayoutsForTableView } from "services/BackendCommunication";
import { getPayoutsAccountingForTableView } from '../../services/BackendCommunication';
import { groupByNameToIdPayouts } from "utils/payouts.utils";
import PayoutActionsDialog from "./PayoutActionsDialog";
import { payoutsAddAndDeleteOthersStore } from "redux/actions/PayoutsActions";
import { getRetirosButtons } from 'utils/royalties.utils';

const Payouts = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(store => store.userData);
  const rol = currentUserData.rol;
  const payoutsStore = useSelector(store => store.payouts.payouts);

  const isAdmin = userIsAdmin(rol);
  // const isAdmin = false;

  // INIT SEARCH STUFF
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [emailAccSearchValue, setEmailAccSearchValue] = useState("");
  // END SEARCH STUFF

  const defaultAccParams = {
    field: "ownerEmail", value: isAdmin ? "" : currentUserData.email, caller: "all",
    groupBy: { id: 'ownerEmail', name: "Usuario" }, orderBy: { field: 'totalPayed', order: 'DESC' }
  };

  // const [emptyResults, setEmptyResults] = useState(false);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [payoutsRows, setPayoutsRows] = useState([]);
  const [openNotAdminWarning, setOpenNotAdminWarning] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [payoutsTableIsOpen, setPayoutsTableIsOpen] = useState(true);

  const [accountingRows, setAccountingRows] = useState(getSkeletonWdAccountingRow(2));
  const [filterPayoutsParams, setFilterPayoutsParams] = useState(defaultAccParams);
  const [accountingTableIsOpen, setAccountingTableIsOpen] = useState(true);
  const [openPayoutActionsDialog, setOpenPayoutActionsDialog] = useState({ open: false, payoutId: "" });

  // Pagos individuales
  useEffect(() => {
    if (payoutsStore.length > 0) {
      setPayoutsRows(payoutsStore.map(wdRow => isAdmin
        ? createPayoutRowForAdmin(wdRow, setOpenPayoutActionsDialog) : createPayoutRowForUser(wdRow)));
    }
    else {
      setPayoutsRows([]);
    };
  }, [payoutsStore])

  useEffect(() => {
    const getPayoutsCountAndRows = async () => {
      let { field, value, caller } = filterPayoutsParams;
      if (caller === "accounting") return;
      setPayoutsRows(getSkeletonPayoutRow(isAdmin ? rowsPerPage : 3));
      let { count, payouts } = await getPayoutsForTableView(field, value, rowsPerPage, rowsPerPage * page, dispatch);
      setTotalCount(count);
      dispatch(payoutsAddAndDeleteOthersStore(payouts));
    }

    getPayoutsCountAndRows();
  }, [page, rowsPerPage, filterPayoutsParams])

  // Total de cada usuario
  useEffect(() => {
    const getAccountingInfo = async () => {
      let accountingValues = [];
      let { groupBy, field, value, orderBy, caller } = filterPayoutsParams;
      if (caller === "royalties") return;
      setAccountingRows(getSkeletonWdAccountingRow(accountingRows.length > 0 ? accountingRows.length : 2));
      accountingValues = await getPayoutsAccountingForTableView(field, value, groupBy.id, orderBy, dispatch);

      if (accountingValues === "EMPTY" || accountingValues === "ERROR") accountingValues = [];
      let accountingRowsToShow = getPayoutAccountingRows(accountingValues, groupBy, 50, orderBy);
      let totals = value
        ? accountingRowsToShow.length !== 0 ? [] : getTotalsPayoutsAccountingRow([])
        : getTotalsPayoutsAccountingRow(accountingValues);
      setAccountingRows([totals, ...accountingRowsToShow]);
    }

    getAccountingInfo();
  }, [filterPayoutsParams])

  const handleCollapseAccounting = () => setAccountingTableIsOpen(!accountingTableIsOpen);
  const handleCollapseRoyalties = () => setPayoutsTableIsOpen(!payoutsTableIsOpen);

  const headersPayoutsName = isAdmin
    ? getPayoutsHeadersForAdmin.map(headerWithWidth => headerWithWidth.name)
    : getPayoutsHeadersForUser.map(headerWithWidth => headerWithWidth.name);
  const headersPayoutsWidth = isAdmin
    ? getPayoutsHeadersForAdmin.map(headerWithWidth => headerWithWidth.width)
    : getPayoutsHeadersForUser.map(headerWithWidth => headerWithWidth.width);
  const headersAccountingName = getWdAccountingHeadersForUser(filterPayoutsParams.groupBy).map(headerWithWidth => headerWithWidth.name);
  const headersAccountingWidth = getWdAccountingHeadersForUser(filterPayoutsParams.groupBy).map(headerWithWidth => headerWithWidth.width);

  const handleChangePage = (event, newPage) => {
    setPayoutsRows(getSkeletonPayoutRow(rowsPerPage));
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPayoutsRows(getSkeletonPayoutRow(rowsPerPage));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let appBarSx = { borderRadius: '0em', backgroundColor: whiteColor };
  let payoutsTableParams = {
    rows: payoutsRows, headers: headersPayoutsName, columnsWidth: headersPayoutsWidth,
    totalCount, handleChangePage, page, handleChangeRowsPerPage, rowsPerPage,
    headersHeight: 65, maxLengthChars: 17, maxWidthText: 250, rowsAlign: 'center',
    rowsHeight: 60
  };

  let accountingTableParams = {
    rows: accountingRows, headers: headersAccountingName, columnsWidth: headersAccountingWidth,
    totalCount: 0, headersHeight: 45, rowsHeight: 30, maxLengthChars: 60, maxWidthText: 300,
    rowsAlign: 'left'
  };

  // INIT SEARCH STUFF
  const setSkeletonRows = caller => {
    if (caller === "royalties") setPayoutsRows(getSkeletonPayoutRow(rowsPerPage));
    if (caller === "accounting") setAccountingRows(getSkeletonWdAccountingRow(accountingRows.length));
  }

  const onSearchEmailHandler = async (email, caller) => {
    if (!email) return;
    setSkeletonRows(caller);
    setFilterPayoutsParams({ ...filterPayoutsParams, caller, field: "ownerEmail", value: email })
  }

  const handleEnterKeyPress = (event, searchProps, caller) => {
    if (event.key === 'Enter') onSearchEmailHandler(searchProps.value, caller);
  }

  const emailSearchProps = { shortName: "Email", name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailSearchValue.trim().toLowerCase(), setValue: setEmailSearchValue };
  const emailAccSearchProps = { shortName: "Email", name: "Email", handleEnterKeyPress, onSearchHandler: onSearchEmailHandler, value: emailAccSearchValue.trim().toLowerCase(), setValue: setEmailAccSearchValue };

  const handleChangeGroupBy = groupByName => {
    setFilterPayoutsParams({
      ...filterPayoutsParams,
      caller: 'accounting',
      groupBy: { id: groupByNameToIdPayouts(groupByName), name: groupByName },
      orderBy: { field: groupByNameToIdPayouts(groupByName) === "transferMonth" ? 'transferMonth' : 'totalPayed', order: "DESC" }
    })
  }

  const groupByProps = { helper: "Agrupar según", values: payoutsGroupByValues, handleChangeGroupBy, value: filterPayoutsParams.groupBy }

  const cleanAccountingParams = () => {
    setFilterPayoutsParams({ ...defaultAccParams, caller: "accounting" });
    setAccountingRows(getSkeletonWdAccountingRow(accountingRows.length > 10 ? accountingRows.length : isAdmin ? 10 : 3));
    setEmailAccSearchValue("");
  }

  const cleanPayoutsParams = () => {
    setFilterPayoutsParams({ ...defaultAccParams, caller: "royalties" });
    setPayoutsRows(getSkeletonPayoutRow(accountingRows.length > 10 ? accountingRows.length : isAdmin ? 10 : 3));
    setEmailSearchValue("");
  }

  const cleanSearchResults = caller => {
    if (caller === "accounting") cleanAccountingParams();
    if (caller === "royalties") cleanPayoutsParams();
  }
  // END SEARCH STUFF

  const buscadoresAccounting = isAdmin ? [emailAccSearchProps] : []
  const buscadoresRoyalties = isAdmin ? [emailSearchProps] : [];

  const handleCloserWaitingRoyalties = () => {
    setLoadingPayouts(false);
  }

  return (
    <>
      <Backdrop open={false}>
        <CircularProgress />
      </Backdrop>

      <PayoutActionsDialog isOpen={openPayoutActionsDialog.open}
        handleClose={() => setOpenPayoutActionsDialog({ open: false, payoutId: "" })}
        payoutId={openPayoutActionsDialog.payoutId} />

      <WaitingDialog isOpen={loadingPayouts} title="Cargando Pagos" contentTexts={waitForPayouts}
        handleClose={handleCloserWaitingRoyalties} successImageSource="/images/success.jpg" size="sm" />

      <InfoDialog isOpen={openNotAdminWarning} handleClose={() => setOpenNotAdminWarning(false)}
        title={"Necesitas permisos de Administrador"} contentTexts={resourceNotYoursText} />

      {/* <InfoDialog isOpen={emptyResults} handleClose={() => setEmptyResults(false)}
        title={"Sin resultados"} contentTexts={emptyPaysResult} /> */}

      <Grid item xs={12} sx={{ textAlign: "center" }}>

      {getRetirosButtons(buttonColorStyle, "Ver Regalías")}

        <Grid item xs={12} padding={0} >
          <SearchNavbar searchArrayProps={buscadoresRoyalties} cleanSearchResults={cleanSearchResults}
            appBarSx={appBarSx} appBarTitle='Retiros' mainSearchColor={fugaGreen}
            isOpen={payoutsTableIsOpen} handleCollapseTable={handleCollapseRoyalties} />
        </Grid>

        {payoutsTableIsOpen && <Grid item xs={12} paddingBottom={2} sx={{ margin: 'auto' }}>
          <CustomizedTable {...payoutsTableParams} />
        </Grid>}

        <Grid item xs={12} paddingTop={2} >
          <AccountingBar searchArrayProps={buscadoresAccounting} cleanSearchResults={cleanSearchResults}
            appBarSx={appBarSx} appBarTitle='Pagos' mainSearchColor={fugaGreen} isOpen={accountingTableIsOpen}
            handleCollapseTable={handleCollapseAccounting} groupByProps={groupByProps} />
        </Grid>

        {accountingTableIsOpen && <Grid item xs={12} sx={{ margin: 'auto' }}>
          <CustomizedTable {...accountingTableParams} />
        </Grid>}

      </Grid>

    </>
  )
}

export default Payouts;

const buttonColorStyle = {
  color: 'white', width: "200px", backgroundColor: fugaGreen, '&:hover': { backgroundColor: fugaGreen, color: 'white' }, raisedPrimary: {
    color: 'white',
  },
};