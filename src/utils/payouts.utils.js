import { IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material/';

export const iconOpenActionsPayouts = (elemId, setOpenActionsDialog) => {
  return <IconButton onClick={() => setOpenActionsDialog({ open: true, payoutId: elemId })}>
    <Settings />
  </IconButton>
}

export const groupByNameToIdPayouts = groupByName => {
  const reducer = {
    "Usuario": "userEmail",
    "Mes del Pago": "transferMonth",
    "Moneda": "currency"
  }
  return reducer[groupByName] || "userEmail";
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