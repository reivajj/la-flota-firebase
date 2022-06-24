import { Skeleton } from '@mui/material';

export const accExample = [
  {
    "revenuesUSD": 111110.3844300000000004,
    "dsp": "Spotify",
    "streams": 443333000000,
    "downloads": 0,
    "revenuesEUR": 2320.33
  },
  {
    "revenuesUSD": 0.02276,
    "dsp": "Youtube Ad Supported",
    "streams": 51,
    "downloads": 0,
    "revenuesEUR": 0
  },
  {
    "revenuesUSD": 0.01611,
    "dsp": "Apple Music",
    "streams": 3,
    "downloads": 0,
    "revenuesEUR": 1
  },
  {
    "revenuesUSD": 0.0026600000000000005,
    "dsp": "Facebook Audio Library",
    "streams": 195,
    "downloads": 0,
    "revenuesEUR": 0
  },
  {
    "revenuesUSD": 0.00001,
    "dsp": "Facebook Fingerprinting",
    "streams": 1,
    "downloads": 0,
    "revenuesEUR": 0
  }
]

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

const groupByIdToName = id => {
  let idToNameReducer = {
    'dsp': "DSP's",
    'territory': 'Territorios',
    'releaseArtist': 'Artistas'
  }
  return idToNameReducer[id] || "DSP's";
}

export const groupByNameToId = name => {
  let nameToIdReducer = {
    "DSP's": 'dsp',
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

export const accountingGroupByValues = ["DSP's", "Artistas", "Tracks", "Territorios", "Lanzamientos"];

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
    [groupByProp.name]: dspReducer(accountingFromDB[groupByProp.id]),
    streams: formatThousandsPoint(accountingFromDB.streams),
    downloads: formatThousandsPoint(accountingFromDB.downloads),
    netRevenueEUR: 'EUR ' + formatThousandsPoint(formatPeriodComma(parseFloat(accountingFromDB.revenuesEUR).toFixed(2))),
    netRevenueUSD: 'USD ' + formatThousandsPoint(formatPeriodComma(parseFloat(accountingFromDB.revenuesUSD).toFixed(2))),
  }
}

export const getTotalesAccountingRow = accountingValues => {
  let totals = { netRevenueEUR: 0, netRevenueUSD: 0, streams: 0, downloads: 0 };
  totals = { dsp: "Totales", ...totals };
  console.log(accountingValues);
  accountingValues.forEach(accVal => {
    totals.streams += accVal.streams;
    totals.downloads += accVal.downloads;
    totals.netRevenueUSD += accVal.revenuesUSD;
    totals.netRevenueEUR += accVal.revenuesEUR;
  })

  return {
    dsp: totals.dsp, streams: formatThousandsPoint(totals.streams), downloads: formatThousandsPoint(totals.downloads),
    netRevenueEUR: 'EUR ' + formatThousandsPoint(formatPeriodComma(parseFloat(totals.netRevenueEUR).toFixed(2))),
    netRevenueUSD: 'USD ' + formatThousandsPoint(formatPeriodComma(parseFloat(totals.netRevenueUSD).toFixed(2)))
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
      netRevenueEUR: loadingSkeleton(),
      netRevenueUSD: loadingSkeleton(),
      streams: loadingSkeleton(),
      downloads: loadingSkeleton(),
    }
  })
}