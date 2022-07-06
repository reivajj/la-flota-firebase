import { IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material/';

export const iconOpenActionsPayouts = (elemId, setOpenActionsDialog) => {
  return <IconButton onClick={() => setOpenActionsDialog({ open: true, id: elemId })}>
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