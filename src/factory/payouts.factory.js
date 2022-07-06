import { Skeleton } from '@mui/material';
import { truncateFloat } from 'utils';
import { iconOpenActionsPayouts } from '../utils/payouts.utils';

export const payoutDefaultValues = {
  status: "Esperando confirmación", requestDate: "", transferDate: "", transferMonth: "",
  currency: "ARS", transferTotalAskedCurrency: 0, currencyRateToUsd: 0, transferTotalUsd: 0,
  historicTotalUsd: 0, userCuit: "", id: "", userEmail: "", userId: "", alreadyPaidUsd: "",
  comissionAskedCurrency: "", comissionCurrency: "", comissionUsd: "", userName: "", cupon: "",
  userLastName: "", cbuCvuAlias: "", paypalEmail: "", paypalId: "", paypalFee: "",
  payoneerEmail: "", payoneerFee: "", payoneerId: "", taxesUsd: 0, taxesOtherCurrency: 0, taxesCurrency: ""
}

export const getPayoutsHeadersForUser = [
  { name: "Opciones", width: "3%" }, { name: "Estado", width: "8%" }, { name: "Día Pedido", width: "10%" }, { name: "Día Pagado", width: "10%" },
  { name: "Moneda", width: "5%" }, { name: "Tranferencia", width: "10%" }, { name: "Cotización (USD)", width: "10%" },
  { name: "Tranferencia (USD)", width: "10%" }, { name: "Total ya pagado (USD)", width: "10%" },
  { name: "CUIT", width: "12%" }, { name: "ID Pago", width: "12%" }
]

export const getPayoutsHeadersForAdmin = [
  { name: "Opciones", width: "3%" }, { name: "Email", width: "10%" }, { name: "Estado", width: "5%" }, { name: "Día Pedido", width: "10%" },
  { name: "Día Pagado", width: "10%" }, { name: "Moneda", width: "5%" }, { name: "Tranferencia", width: "7%" },
  { name: "Cotización (USD)", width: "7%" }, { name: "Tranferencia (USD)", width: "7%" },
  { name: "Total ya pagado (USD)", width: "7%" }, { name: "CUIT", width: "8%" }, { name: "ID Pago", width: "10%" }
]

export const getWdAccountingHeadersForUser = groupByProp => [
  { name: groupByProp.name, width: "35%" }, { name: "Último pago", width: "20%" },
  { name: "Cantidad de Pagos", width: "20%" }, { name: "Total Pagado (USD)", width: "25%" },
]

export const payoutsGroupByValues = ["Usuario", "Mes del Pago", "Moneda"];

export const createPayoutRowForUser = payoutRowFromDB => {
  return {
    status: (payoutRowFromDB.status === "Migrated" || payoutRowFromDB.status === "Migrated DK") ? "Completado" : payoutRowFromDB.status,
    requestDate: payoutRowFromDB.requestDate,
    transferDate: payoutRowFromDB.transferDate || "Esperando pago.",
    currency: payoutRowFromDB.currency,
    transferTotalAskedCurrency: payoutRowFromDB.currency !== "USD" ? payoutRowFromDB.transferTotalAskedCurrency : payoutRowFromDB.transferTotalUsd,
    currencyRate: payoutRowFromDB.currencyRateToUsd === 0 ? 1 : payoutRowFromDB.currencyRateToUsd,
    transferTotalUsd: payoutRowFromDB.transferTotalUsd,
    historicTotalUsd: payoutRowFromDB.historicTotalUsd,
    userCuit: payoutRowFromDB.userCuit,
    id: payoutRowFromDB.id,
  }
}

export const createPayoutRowForAdmin = payoutRowFromDB => {
  let payoutForAdmin = {
    options: iconOpenActionsPayouts(payoutRowFromDB.id, () => console.log("HOAL")),
    userEmail: payoutRowFromDB.userEmail, ...createPayoutRowForUser(payoutRowFromDB)
  };
  return payoutForAdmin;
}

const createAccPayoutRowForAdmin = (accRow, groupByProp) => {
  return {
    [groupByProp.name]: accRow[groupByProp.id],
    lastPayAskedDay: accRow.lastPayAskedDay,
    cantPayouts: formatThousandsPoint(accRow.cantPayouts),
    totalPayed: 'USD ' + formatThousandsPoint(formatPeriodComma(truncateFloat(accRow.totalPayed, 2, '.'))),
  }
}

const formatThousandsPoint = number => number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0;
const formatPeriodComma = number => number ? number.toString().replace(".", ",") : 0;

export const getPayoutAccountingRows = (wdRows, groupBy, maxRows, orderByProp) => {
  if (wdRows === []) return [];
  // let sortedAccRows = sortAccountingRows(wdRows, orderByProp);
  return wdRows.map(accountingRow => createAccPayoutRowForAdmin(accountingRow, groupBy)).slice(0, maxRows)
}

export const getTotalesWdAccountingRow = accountingValues => {
  let totals = { email: "Totales", cantPayouts: 0, lastPayAskedDay: 0, totalPayed: 0 };
  if (accountingValues.length === 0) return totals;
  console.log(accountingValues);
  accountingValues.forEach(accVal => {
    totals.cantPayouts += accVal.cantPayouts;
    totals.totalPayed += accVal.totalPayed;
  })

  return {
    email: totals.email,
    lastPayAskedDay: accountingValues[accountingValues.length - 1].lastPayAskedDay,
    cantPayouts: formatThousandsPoint(totals.cantPayouts),
    totalPayed: 'USD ' + formatThousandsPoint(formatPeriodComma(truncateFloat(totals.totalPayed, 2, '.'))),
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
      userCuit: loadingSkeleton(),
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