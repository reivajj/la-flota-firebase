import { Skeleton } from '@mui/material';
import { formatPeriodComma, truncateFloat } from 'utils';
import { dspReducer, reduceGroupByField, sortAccountingRows, sumEqualDSPNames } from 'utils/royalties.utils';
import { formatThousandsPoint } from '../utils';

const stringReducer = string => {
  return string.length > 143
    ? string.slice(0, 40) + '...'
    : string;
}

export const getRoyaltyHeadersForUser = [
  { name: "Mes", width: "5%" }, { name: "Artista", width: "13%" },
  { name: "DSP", width: "7%" }, { name: "Track", width: "13%" }, { name: "Lanzamiento", width: "13%" }, { name: "ISRC", width: "5%" },
  { name: "UPC", width: "5%" }, { name: "Regalías", width: "5%" }, { name: "Moneda", width: "5%" }, { name: "Territorio", width: "5%" },
  { name: "Usuario", width: "5%" }, { name: "Tipo de venta", width: "9%" }, { name: "Cantidad", width: "5%" },
  { name: "Stream Id", width: "5%" }
]

export const groupByNameToId = name => {
  let nameToIdReducer = {
    "DSP's": 'dsp',
    'Mes del Reporte': 'reportedMonth',
    'Territorios': 'territory',
    'Artistas': 'releaseArtist',
    'Tracks': 'assetTitle',
    'Lanzamientos': 'releaseTitle',
  }
  return nameToIdReducer[name] || "dsp";
}

export const getAccountingHeadersForUser = groupByProp => [
  { name: groupByProp.name, width: "25%" }, { name: "Streams", width: "15%" },
  { name: "Descargas", width: "10%" }, { name: "Regalías (EUR)", width: "25%" },
  { name: "Regalías (USD)", width: "25%" },
]

export const accountingGroupByValues = ["DSP's", "Mes del Reporte", "Artistas", "Tracks", "Territorios", "Lanzamientos"];

export const createRoyaltyRowForUser = royaltyFromDB => {
  return {
    saleStartDate: royaltyFromDB.saleStartDate.slice(0, 7),
    releaseArtist: stringReducer(royaltyFromDB.releaseArtist),
    dsp: dspReducer(royaltyFromDB.dsp),
    assetTitle: stringReducer(royaltyFromDB.assetTitle),
    releaseTitle: stringReducer(royaltyFromDB.releaseTitle),
    isrc: royaltyFromDB.isrc,
    upc: royaltyFromDB.upc,
    netRevenue: truncateFloat(royaltyFromDB.netRevenue, 4, '.'),
    netRevenueCurrency: royaltyFromDB.netRevenueCurrency,
    territory: royaltyFromDB.territory,
    saleUserType: royaltyFromDB.saleUserType ? royaltyFromDB.saleUserType : "YT User",
    saleType: royaltyFromDB.saleType === "Video Stream (Audio + Video)" ? "Video Stream (Video + Audio)" : royaltyFromDB.saleType,
    assetQuantity: royaltyFromDB.assetQuantity,
    id: royaltyFromDB.saleId,
  }
}

export const createAccountingRowForUser = (accountingFromDB, groupByProp) => {
  return {
    [groupByProp.name]: reduceGroupByField(groupByProp.id, accountingFromDB[groupByProp.id]),
    streams: formatThousandsPoint(accountingFromDB.streams),
    downloads: formatThousandsPoint(accountingFromDB.downloads),
    netRevenueEUR: 'EUR ' + formatThousandsPoint(formatPeriodComma(truncateFloat(accountingFromDB.revenuesEUR, 2, '.'))),
    netRevenueUSD: 'USD ' + formatThousandsPoint(formatPeriodComma(truncateFloat(accountingFromDB.revenuesUSD, 2, '.'))),
  }
}

export const getAccountingRows = (accRows, groupBy, maxRows, orderByProp) => {
  if (accRows === []) return [];
  let squashedAccRows = sumEqualDSPNames(accRows, groupBy);
  let sortedAccRows = sortAccountingRows(squashedAccRows, orderByProp);
  return sortedAccRows.map(accountingRow => createAccountingRowForUser(accountingRow, groupBy)).slice(0, maxRows)
}

export const getTotalesAccountingRow = accountingValues => {
  let totals = { dsp: "Totales", netRevenueEUR: 0, netRevenueUSD: 0, streams: 0, downloads: 0 };
  if (accountingValues.length === 0) return totals;
  console.log(accountingValues);
  accountingValues.forEach(accVal => {
    totals.streams += dspReducer(accVal.dsp) === "iTunes" ? 0 : accVal.streams;
    totals.downloads += dspReducer(accVal.dsp) === "iTunes" ? accVal.downloads + accVal.streams : accVal.downloads;
    totals.netRevenueUSD += accVal.revenuesUSD;
    totals.netRevenueEUR += accVal.revenuesEUR;
  })

  return {
    dsp: totals.dsp, streams: formatThousandsPoint(totals.streams), downloads: formatThousandsPoint(totals.downloads),
    netRevenueEUR: 'EUR ' + formatThousandsPoint(formatPeriodComma(truncateFloat(totals.netRevenueEUR, 2, '.'))),
    netRevenueUSD: 'USD ' + formatThousandsPoint(formatPeriodComma(truncateFloat(totals.netRevenueUSD, 2, '.')))
  }
}

const loadingSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ height: '30px', mx: 1 }} />
);

export const getSkeletonRoyaltiesRow = rowsPerPage => {

  return [...Array(rowsPerPage)].map(() => {
    return {
      saleStartDate: loadingSkeleton(),
      releaseArtist: loadingSkeleton(),
      dsp: loadingSkeleton(),
      assetTitle: loadingSkeleton(),
      releaseTitle: loadingSkeleton(),
      isrc: loadingSkeleton(),
      upc: loadingSkeleton(),
      netRevenue: loadingSkeleton(),
      netRevenueCurrency: loadingSkeleton(),
      territory: loadingSkeleton(),
      saleUserType: loadingSkeleton(),
      saleType: loadingSkeleton(),
      assetQuantity: loadingSkeleton(),
      id: loadingSkeleton(),
    }
  })
}

export const getSkeletonAccountingRow = rowsPerPage => {
  return [...Array(rowsPerPage)].map(() => {
    return {
      dsp: loadingSkeleton(),
      netRevenueEUR: loadingSkeleton(),
      netRevenueUSD: loadingSkeleton(),
      streams: loadingSkeleton(),
      downloads: loadingSkeleton(),
    }
  })
}