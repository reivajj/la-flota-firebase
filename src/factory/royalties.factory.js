import { Skeleton } from '@mui/material';

const stringReducer = string => {
  return string.length > 12
    ? string.slice(0, 13) + '...'
    : string;
}

export const createRoyaltyRowForUser = royaltyFromDB => {
  return {
    id: royaltyFromDB.saleId,
    saleStartDate: royaltyFromDB.saleStartDate,
    netRevenue: parseFloat(royaltyFromDB.netRevenue).toFixed(6),
    netRevenueCurrency: royaltyFromDB.netRevenueCurrency,
    releaseArtist: stringReducer(royaltyFromDB.releaseArtist),
    releaseTitle: stringReducer(royaltyFromDB.releaseTitle),
    assetTitle: stringReducer(royaltyFromDB.assetTitle),
    upc: royaltyFromDB.upc,
    isrc: royaltyFromDB.isrc,
    dsp: stringReducer(royaltyFromDB.dsp),
    saleUserType: royaltyFromDB.saleUserType,
    territory: royaltyFromDB.territory,
    assetQuantity: royaltyFromDB.assetQuantity,
  }
}

const loadingSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ height: 30, mx: 1 }} />
);

export const getSkeletonRoyaltiesRow = rowsPerPage => {

  return [...Array(rowsPerPage)].map((index) => {
    return {
      id: index,
      saleStartDate: loadingSkeleton(),
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
      assetQuantity: loadingSkeleton(),
    }
  })
}

export const getRoyaltyHeadersForUser = [
  "Stream Id", "Fecha", "Ganancia", "Moneda", "Artista", "Lanzamiento",
  "Canción", "UPC", "ISRC", "DSP", "Usuario", "Territorio", "Cantidad"
]