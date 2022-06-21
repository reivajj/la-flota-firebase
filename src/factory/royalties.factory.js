import { Skeleton } from '@mui/material';

const stringReducer = string => {
  return string.length > 143
    ? string.slice(0, 40) + '...'
    : string;
}

const dspReducer = dspString => {
  let dspObject = {
    'Amazon Unlimited': 'Amazon',
    'Netease Cloud Music': 'Netease',
    'Facebook Fingerprinting': 'Facebook',
    'Facebook Audio Library': 'Instagram',
    'Youtube Music': 'Youtube M.',
    'Youtube Ad Supported': 'Youtube Ad'
  }
  return dspObject[dspString] || dspString;
}

export const getRoyaltyHeadersForUser = [
  { name: "Mes", width: "5%" }, { name: "Artista", width: "13%" },
  { name: "DSP", width: "7%" }, { name: "Track", width: "13%" }, { name: "Lanzamiento", width: "13%" }, { name: "ISRC", width: "5%" },
  { name: "UPC", width: "5%" }, { name: "Regalías", width: "5%" }, { name: "Moneda", width: "5%" }, { name: "Territorio", width: "5%" },
  { name: "Usuario", width: "5%" }, { name: "Tipo de venta", width: "9%" }, { name: "Cantidad", width: "5%" },
  { name: "Stream Id", width: "5%" }
]

export const getAccountingHeadersForUser = [
  { name: "DSP", width: "25%" }, { name: "Streams", width: "25%" },
  { name: "Descargas", width: "25%" }, { name: "Regalías", width: "25%" }
]

export const createRoyaltyRowForUser = royaltyFromDB => {
  return {
    saleStartDate: royaltyFromDB.saleStartDate.slice(0, 7),
    releaseArtist: stringReducer(royaltyFromDB.releaseArtist),
    dsp: dspReducer(royaltyFromDB.dsp),
    assetTitle: stringReducer(royaltyFromDB.assetTitle),
    releaseTitle: stringReducer(royaltyFromDB.releaseTitle),
    isrc: royaltyFromDB.isrc,
    upc: royaltyFromDB.upc,
    netRevenue: parseFloat(royaltyFromDB.netRevenue).toFixed(4),
    netRevenueCurrency: royaltyFromDB.netRevenueCurrency,
    territory: royaltyFromDB.territory,
    saleUserType: royaltyFromDB.saleUserType ? royaltyFromDB.saleUserType : "YT User",
    saleType: royaltyFromDB.saleType === "Video Stream (Audio + Video)" ? "Video Stream (Video + Audio)" : royaltyFromDB.saleType,
    assetQuantity: royaltyFromDB.assetQuantity,
    id: royaltyFromDB.saleId,
  }
}

const formatThousandsPoint = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatPeriodComma = number => number.toString().replace(".", ",");

export const createAccountingRowForUser = (accountingFromDB, groupByProp) => {
  return {
    [groupByProp]: accountingFromDB[groupByProp],
    streams: formatThousandsPoint(accountingFromDB.streams),
    downloads: formatThousandsPoint(accountingFromDB.downloads),
    netRevenue: 'EUR ' + formatPeriodComma(parseFloat(accountingFromDB.revenues).toFixed(2)),
  }
}

export const getTotalesAccountingRow = accountingValues => {
  let totals = { netRevenue: 0, streams: 0, downloads: 0 };
  totals = { dsp: "Totales", ...totals };

  accountingValues.forEach(accVal => {
    totals.streams += accVal.streams;
    totals.downloads += accVal.downloads;
    totals.netRevenue += accVal.revenues;
  })

  return {
    dsp: totals.dsp, streams: formatThousandsPoint(totals.streams), downloads: formatThousandsPoint(totals.downloads),
    netRevenue: 'EUR ' + formatPeriodComma(parseFloat(totals.netRevenue).toFixed(2))
  }
}

const loadingSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ height: '30px', mx: 1 }} />
);

export const getSkeletonRoyaltiesRow = rowsPerPage => {

  return [...Array(rowsPerPage)].map((index) => {
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
      id: index,
    }
  })
}

export const getSkeletonAccountingRow = rowsPerPage => {
  return [...Array(rowsPerPage)].map(() => {
    return {
      dsp: loadingSkeleton(),
      netRevenue: loadingSkeleton(),
      streams: loadingSkeleton(),
      downloads: loadingSkeleton(),
    }
  })
}