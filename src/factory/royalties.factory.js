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
  { name: "UPC", width: "5%" }, { name: "Regalía", width: "5%" }, { name: "Moneda", width: "5%" }, { name: "Territorio", width: "5%" },
  { name: "Usuario", width: "5%" }, { name: "Tipo de venta", width: "9%" }, { name: "Cantidad", width: "5%" },
  { name: "Stream Id", width: "5%" }
]

export const createRoyaltyRowForUser = royaltyFromDB => {
  return {
    saleStartDate: royaltyFromDB.saleStartDate.slice(0,7),
    releaseArtist: stringReducer(royaltyFromDB.releaseArtist),
    dsp: dspReducer(royaltyFromDB.dsp),
    assetTitle: stringReducer(royaltyFromDB.assetTitle),
    releaseTitle: stringReducer(royaltyFromDB.releaseTitle),
    isrc: royaltyFromDB.isrc,
    upc: royaltyFromDB.upc,
    netRevenue: parseFloat(royaltyFromDB.netRevenue).toFixed(6),
    netRevenueCurrency: royaltyFromDB.netRevenueCurrency,
    territory: royaltyFromDB.territory,
    saleUserType: royaltyFromDB.saleUserType,
    saleType: royaltyFromDB.saleType,
    assetQuantity: royaltyFromDB.assetQuantity,
    id: royaltyFromDB.saleId,
  }
}

const loadingSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ height: '30px', mx: 1 }} />
);

export const getSkeletonRoyaltiesRow = rowsPerPage => {

  return [...Array(rowsPerPage)].map((index) => {
    return {
      saleStartDate: loadingSkeleton(),
      saleEndDate: loadingSkeleton(),
      netRevenue: loadingSkeleton(),
      netRevenueCurrency: loadingSkeleton(),
      releaseArtist: loadingSkeleton(),
      releaseTitle: loadingSkeleton(),
      assetTitle: loadingSkeleton(),
      upc: loadingSkeleton(),
      isrc: loadingSkeleton(),
      dsp: loadingSkeleton(),
      saleUserType: loadingSkeleton(),
      territory: loadingSkeleton(),
      assetOrReleaseSale: loadingSkeleton(),
      assetQuantity: loadingSkeleton(),
      id: index,
    }
  })
}