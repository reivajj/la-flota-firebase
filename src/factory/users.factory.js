export const createUserDocItem = userData => {
  return {
    email: userData.email,
    nombre: userData.nombre,
    apellido: userData.apellido,
    id: userData.id,
    usuarioActivo: true,
    ciudad: "",
    provincia: "",
    telefono: "",
    dni: "",
    imagenUrl: "",
    timestampWhenCreatedUser: Date.now(),
    rol: "user",
    plan: "",
    stats: {
      totalAlbums: 0,
      totalArtists: 0,
      totalLabels: 0,
      totalTracks: 0
    },
    withdrawals: {
      cupones: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      pesos: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      usd: {
        totalAmount: 0,
        totalWithdrawals: 0
      }
    }
  };
}