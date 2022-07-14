export const solicitarRegaliasUrl = window.location.origin === "http://localhost:3001"
  ? "http://localhost:3001/admin/retiros/solicitud" : "https://app.laflota.com.ar/admin/retiros/solicitud";

export const goToRetiros = window.location.origin === "http://localhost:3001"
  ? "http://localhost:3001/admin/retiros" : "https://app.laflota.com.ar/admin/retiros";

export const goToRoyalties = window.location.origin === "http://localhost:3001"
  ? "http://localhost:3001/admin/regalias" : "https://app.laflota.com.ar/admin/regalias";