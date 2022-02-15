export const createUserDocItem = (userData, userInWp) => {
  return {
    email: userData.email,
    userLogin: userInWp.userLogin,
    userRegisteredInWp: userInWp.userRegistrered,
    deletedInWp: userInWp.deleted,
    userIdWp: userInWp.id,
    userStatus: userInWp.userStatus,
    nombre: userData.nombre,
    apellido: userData.apellido,
    subgenerosPropios: [],
    generos: [],
    id: userData.id,
    usuarioActivo: true,
    ciudad: "",
    provincia: "",
    telefono: "",
    dni: "",
    imagenUrl: "",
    timestampWhenCreatedUserInFB: Date.now(),
    rol: "user",
    plan: "charly-garcia",
    stats: {
      totalAlbums: 0,
      totalArtists: 0,
      totalLabels: 0,
      totalTracks: 0,
      totalAlbumsDeleted: 0,
      totalAlbumsTakenDown: 0,
      totalArtistsDeleted: 0,
      totalLabelsDeleted: 0,
      totalTracksDeleted: 0,
      totalArtistsInvited: 0,
      totalCollaborators: 0
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