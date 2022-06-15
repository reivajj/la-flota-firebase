import { Skeleton } from '@mui/material';

const stringReducer = string => {
  return string.length > 120
    ? string.slice(0, 13) + '...'
    : string;
}

export const getRoyaltyHeadersForUser = [
  "Fecha inicial", "Fecha final", "Artista", "DSP", "Track", "Lanzamiento", "ISRC", "UPC", "Regalía", "Moneda", "Territorio",
  "Tipo de Usuario", "Tipo de venta", "Cantidad", "Stream Id"
]

export const createRoyaltyRowForUser = royaltyFromDB => {
  return {
    saleStartDate: royaltyFromDB.saleStartDate,
    saleEndDate: royaltyFromDB.saleEndDate,
    releaseArtist: stringReducer(royaltyFromDB.releaseArtist),
    dsp: stringReducer(royaltyFromDB.dsp),
    assetTitle: stringReducer(royaltyFromDB.assetTitle),
    releaseTitle: stringReducer(royaltyFromDB.releaseTitle),
    isrc: royaltyFromDB.isrc,
    upc: royaltyFromDB.upc,
    netRevenue: parseFloat(royaltyFromDB.netRevenue).toFixed(6),
    netRevenueCurrency: royaltyFromDB.netRevenueCurrency,
    territory: royaltyFromDB.territory,
    saleUserType: royaltyFromDB.saleUserType,
    assetOrReleaseSale: royaltyFromDB.assetOrReleaseSale === "Asset" ? "Track" : "Lanzamiento",
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