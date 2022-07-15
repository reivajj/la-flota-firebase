import { Skeleton } from '@mui/material';
import { formatAllNumber } from 'utils';
import { getPayoutStatus, iconOpenActionsPayouts, getMethodPayFromPayout, getPaymentId, getTotalsEmptyToShow } from '../utils/payouts.utils';
import { yellowPending } from 'variables/colors';

export const payoutDefaultValues = {
  status: "Esperando confirmación", requestDate: "", transferDate: null, transferMonth: "",
  currency: "ARS", transferTotalAskedCurrency: 0, currencyRateToUsd: 0, transferTotalUsd: 0,
  historicTotalUsd: 0, userCuit: "", id: "", userEmail: "", userId: "", alreadyPaidUsd: "",
  comissionAskedCurrency: 0, comissionCurrency: "", comissionUsd: 0, userName: "", cupon: "",
  userLastName: "", cbuCvuAlias: "", paypalEmail: "", paypalId: "", paypalFee: 0,
  payoneerEmail: "", payoneerFee: 0, payoneerId: "", taxesUsd: 0, taxesOtherCurrency: 0, taxesCurrency: ""
}

export const getPayoutsHeadersForUser = [
  { name: "Estado", width: "7%" }, { name: "Día Solicitado", width: "8%" }, { name: "Día Pagado", width: "8%" },
  { name: "Moneda", width: "4%" }, { name: "Transferencia (ARS)", width: "10%" }, { name: "Cotización (USD)", width: "8%" },
  { name: "Transferencia (USD)", width: "10%" }, { name: "Total Solicitado (USD)", width: "12%" },
  { name: "Total Retirado (USD)", width: "13%" }, { name: "Modo de retiro", width: "8%" }, { name: "ID Pago", width: "12%" }
]

export const getPayoutsHeadersForAdmin = [
  { name: "Opciones", width: "3%" }, { name: "Email", width: "10%" }, { name: "Estado", width: "5%" }, { name: "Día Solicitado", width: "8%" },
  { name: "Día Pagado", width: "8%" }, { name: "Moneda", width: "4%" }, { name: "Transferencia (ARS)", width: "7%" },
  { name: "Cotización (USD)", width: "6%" }, { name: "Transferencia (USD)", width: "6%" },
  { name: "Total Solicitado (USD)", width: "9%" }, { name: "Total Retirado (USD)", width: "8%" },
  { name: "Modo de retiro", width: "8%" }, { name: "ID Pago", width: "8%" }
]

export const getPayoutsAccountingHeaders = groupByProp => [
  { name: groupByProp.name, width: "20%" }, { name: "Último pago", width: "20%" },
  { name: "Cantidad de Pagos", width: "20%" }, { name: "Total Pagado (USD)", width: "20%" },
  { name: "Pendiente de Pago (USD)", width: "20%" },
]

export const payoutsGroupByValues = ["Usuario", "Moneda", "Mes del Pago",];

export const createPayoutRowForUser = payoutRowFromDB => {
  return {
    status: getPayoutStatus(payoutRowFromDB.status),
    requestDate: payoutRowFromDB.requestDate,
    transferDate: payoutRowFromDB.transferDate || "Esperando pago.",
    currency: payoutRowFromDB.currency,
    transferTotalAskedCurrency: payoutRowFromDB.currency !== "usd"
      ? formatAllNumber(payoutRowFromDB.transferTotalAskedCurrency, 2, '.') : formatAllNumber(payoutRowFromDB.transferTotalUsd, 2, '.'),
    currencyRate: payoutRowFromDB.currencyRateToUsd === 0 ? 1 : formatAllNumber(payoutRowFromDB.currencyRateToUsd, 2, '.'),
    transferTotalUsd: formatAllNumber(payoutRowFromDB.transferTotalUsd, 2, '.'),
    historicTotalUsd: formatAllNumber(payoutRowFromDB.historicTotalUsd, 2, '.'),
    alreadyPaidUsd: formatAllNumber(payoutRowFromDB.alreadyPaidUsd, 2, '.'),
    methodPay: getMethodPayFromPayout(payoutRowFromDB),
    id: getPaymentId(payoutRowFromDB),
  }
}

export const createPayoutRowForAdmin = (payoutRowFromDB, setOpenActionsDialog) => {
  let payoutForAdmin = {
    options: iconOpenActionsPayouts(payoutRowFromDB.id, setOpenActionsDialog),
    userEmail: payoutRowFromDB.ownerEmail, ...createPayoutRowForUser(payoutRowFromDB)
  };
  return payoutForAdmin;
}

const createAccPayoutRowForAdmin = (accRow, groupByProp, accPending) => {
  
  let groupByValue = groupByProp.id === "transferMonth"
    ? !accRow[groupByProp.id] ? accRow.lastPayAskedDay.slice(0, 7) : accRow[groupByProp.id].slice(0, 7)
    : accRow[groupByProp.id]

  let pendingGroupByValue = accPending.find(pendingRow => {
    let pendingValue = groupByProp.id === "transferMonth" ? pendingRow.lastPayAskedDay.slice(0, 7) : pendingRow[groupByProp.id];
    return pendingValue === groupByValue;
  });
  
  let pendingValue = formatAllNumber(pendingGroupByValue?.totalPayed || 0, 2, '.');
  return {
    [groupByProp.name]: groupByValue,
    lastPayAskedDay: accRow.lastPayAskedDay,
    cantPayouts: formatThousandsPoint(accRow.cantPayouts),
    totalPayed: 'USD ' + formatAllNumber(accRow.totalPayed - (pendingGroupByValue?.totalPayed || 0), 2, '.'),
    pendingPay: <small style={{ fontSize: '1rem', fontWeight: '400', color: parseFloat(pendingValue) > 0 ? "rgb(255, 192, 0)" : "" }}>
      {'USD ' + pendingValue}</small>
  }
}

const formatThousandsPoint = number => number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0;

export const getPayoutAccountingRows = (accPayments, accPendingPayments, groupBy, maxRows, orderByProp) => {
  if (!accPayments || accPayments === "EMPTY" || accPayments.length === 0) return [];
  // let sortedAccRows = sortAccountingRows(wdRows, orderByProp);
  return accPayments.map(accountingRow => createAccPayoutRowForAdmin(accountingRow, groupBy, accPendingPayments)).slice(0, maxRows)
}

export const getTotalsPayoutsAccountingRow = (accountingValues, accPendingValues) => {
  let totals = { email: "Totales", cantPayouts: 0, lastPayAskedDay: 0, totalPayed: 0, pendingPay: 0 };
  if (accountingValues.length === 0) return getTotalsEmptyToShow;

  accountingValues.forEach(accVal => {
    totals.cantPayouts += accVal.cantPayouts;
    totals.totalPayed += accVal.totalPayed;
  })

  accPendingValues.forEach(accPendingVal => totals.pendingPay += accPendingVal.totalPayed);

  return {
    email: <b>{totals.email}</b>,
    lastPayAskedDay: <b>{accountingValues[accountingValues.length - 1].lastPayAskedDay}</b>,
    cantPayouts: <b>{formatThousandsPoint(totals.cantPayouts)}</b>,
    totalPayed: <b>{'USD ' + formatAllNumber(totals.totalPayed - totals.pendingPay, 2, '.') }</b>,
    pendingPay: <b style={{ color: "rgb(255, 192, 0)" }}>{'USD ' + formatAllNumber(totals.pendingPay, 2, '.')}</b>
  }
}

const loadingSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ height: '30px', mx: 1 }} />
);

export const getSkeletonPayoutRow = rowsPerPage => {

  return [...Array(rowsPerPage)].map(() => {
    return {
      options: loadingSkeleton(),
      userEmail: loadingSkeleton(),
      status: loadingSkeleton(),
      requestDate: loadingSkeleton(),
      transferDate: loadingSkeleton(),
      currency: loadingSkeleton(),
      transferTotalAskedCurrency: loadingSkeleton(),
      currencyRate: loadingSkeleton(),
      transferTotalUsd: loadingSkeleton(),
      historicTotalUsd: loadingSkeleton(),
      alreadyPaidUsd: loadingSkeleton(),
      methodPay: loadingSkeleton(),
      id: loadingSkeleton(),
    }
  })
}

export const getSkeletonWdAccountingRow = rowsPerPage => {
  return [...Array(rowsPerPage)].map(() => {
    return {
      email: loadingSkeleton(),
      totalPagos: loadingSkeleton(),
      netRevenueUSD: loadingSkeleton(),
      streams: loadingSkeleton(),
      downloads: loadingSkeleton(),
    }
  })
}