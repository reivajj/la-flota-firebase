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
  if (!payouts || payouts.length === 0) return {};
  let payoutFounded = payouts.find(payout => payout.id === payoutId);
  if (!payoutFounded) return {};
  else return payoutFounded;
}

export const checkPayoutFormValidations = (medioDePago, validator) => {
  if (validator.current.fieldValid('telefono') && validator.current.fieldValid('userLastName')
    && validator.current.fieldValid('userName') && validator.current.fieldValid('userCuit')) {
    if (medioDePago.account === "bank") return validator.current.fieldValid('cbuCvuAlias');
    if (medioDePago.account === "paypal") return validator.current.fieldValid('paypalEmail');
    if (medioDePago.account === "payoneer") return validator.current.fieldValid('payoneerEmail');
    return true;
  }
  else return false;
}

export const getMethodPayFromPayout = payout => {
  if (payout.payoneerEmail) return "Payoneer";
  if (payout.paypalEmail) return "PayPal";
  if (payout.cbuCvuAlias) return "Depósito";
  if (payout.cupon) return "Cupón";
  return "Sin información";
}

export const getPaymentId = payout => {
  if (payout.payoneerEmail) return payout.payoneerId || payout.id;
  if (payout.paypalEmail) return payout.paypalId || payout.id;
  if (payout.cbuCvuAlias) return payout.otherPayId || payout.id;
  if (payout.cupon) return payout.otherPayId || payout.id;
  return payout.id;
}

export const getTotalsEmptyToShow = {
  email: <b>{"Totales"}</b>, cantPayouts: <b>{0}</b>,
  lastPayAskedDay: <b>{0}</b>, totalPayed: <b>{'USD 0,00'}</b>,
  pendingPay: <b>{'USD 0,00'}</b>
};