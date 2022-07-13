import { IconButton, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material/';
import { fugaGreen, yellowPending } from 'variables/colors';

export const iconOpenActionsPayouts = (elemId, setOpenActionsDialog) => {
  return <IconButton onClick={() => setOpenActionsDialog({ open: true, payoutId: elemId })}>
    <Settings />
  </IconButton>
}

export const getPayoutStatus = payoutStatusId => {
  return <Typography sx={{ color: payoutStatusId !== "REQUESTED" ? fugaGreen : yellowPending }} > {payoutStatusId !== "REQUESTED" ? "Completado" : "Solicitado"}</Typography >
}

export const groupByNameToIdPayouts = groupByName => {
  const reducer = {
    "Usuario": "ownerEmail",
    "Mes del Pago": "transferMonth",
    "Moneda": "currency"
  }
  return reducer[groupByName] || "ownerEmail";
}

export const getPayIdField = payout => {
  if (payout.cbuCvuAlias) return 'otherPayId';
  if (payout.paypalEmail) return 'paypalId';
  if (payout.payoneerEmail) return 'payoneerId';
  return "otherPayId";
}

export const getPayoutById = (payouts, payoutId) => {
  let payoutFounded = payouts.find(payout => payout.id === payoutId);
  if (!payoutFounded) return {};
  else return payoutFounded;
}