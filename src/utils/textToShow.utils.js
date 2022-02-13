

export const publicationDateWarning = [
  "Elegí la fecha en la que querés que este lanzamiento sea publicado en las DSPs.Si elegís la fecha de hoy, o mañana, no significa que tu lanzamiento va a estar disponible inmediatamente.Se procesará con la fecha que seleccionaste pero según la demanda, los lanzamientos pueden demorar hasta 1 - 2 días en aprobarse y procesarse, a la vez las DSPs tienen tiempos variables, y por último puede haber errores o que necesitemos corregir aspectos de tu lanzamiento.",
  < br />, "Por lo que: Si es muy importante que tu álbum se publique en una fecha exacta del futuro(por ej, para una campaña promocional), recomendamos trabajar y seleccionar una fecha con al menos 14 días de anticipación, en la cual podemos asegurarte que estará disponible en la mayoría de las DSPs principales a la vez.",
  < br />, "Si es tu primer lanzamiento(y aún no tenés perfil en las DSPs) recomendamos que elijas una fecha de acá a 5 - 7 días en el futuro para que tu perfil se cree correctamente.",
];

export const featuringArtistTooltip = [
  "Indica si el Artista será Principal o Featuring.",
  "Presionar para más información."
]

export const infoSpotifyUri = [
  "Ingresa el código URi de Spotify.", <br />,
  "Ejemplo: spotify:artist:1JTD8FzXyY8Pk3lX1FIkpG", <br />,
  "Haz click para más información."
];

export const infoHelperTextAppleId = [
  "Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo.", <br />,
  "Podes encontrarla en tu perfil en iTunes(son los últimos dígitos de la URL de tu perfil)."
]

export const preSaleCheckBoxHelper = [
  "Podés permitir que tus seguidores compren tu trabajo en iTunes, Amazon y Google Play antes de la fecha del lanzamiento", <br />,
  "(les llegará el álbum el día del lanzamiento).Es ideal para generar campañas de marketing alrededor de la fecha de lanzamiento. ", <br />,
  " Para que funcione debés elegir una fecha de inicio de Pre - Compra anterior a la fecha del lanzamiento que seleccionaste.La Fecha de ", <br />,
  " Lanzamiento debe ser de al menos 10 días en el futuro.Por ej: si la fecha de lanzamiento que seleccionaste es en 10 días desde hoy, el Pre - Order podría iniciar en 5 días desde hoy."
];

export const oldReleaseCheckBoxHelper = ["Si el lanzamiento ya fue publicado alguna vez y querés mostrar la fecha original del lanzamiento."]

export const lanzamientoColaborativoTooltip = [
  "Seleccioná si el lanzamiento pertenece a dos o más artistas.", <br />,
  "A diferencia de agregar un artista como invitado en una canción (Featuring),", <br />,
  "esta opción publicará el álbum en los perfiles de cada uno de los artistas y pertenecerá a ambos.", <br />,
  "Presionar para ver Ejemplo de un Lanzamiento con dos Artistas en Spotify."
]

export const albumCoverHelperText = [
  "El arte de tapa debe ser una imagen de alta calidad.", < br />,
  "El archivo debe ser JPG de colores RGB de mínimo 1400 * 1400px y siempre debe ser CUADRADA", < br />,
  "(si necesitás ayuda consultá a tu diseñador o avisanos y te recomendamos diseñadores que trabajan con nosotros)."
]

export const deleteAlbumDialogText = "Confirma que quieres eliminar el Album. Se eliminarán todas las canciones que lo componen y se dará de baja de todas las DSPs.";

export const getNumeracionOrdinalFromIndex = [
  "Primer", "Segundo", "Tercer", "Cuarto", "Quinto", "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo", "Duodécimo", "Decimotercer",
  "Decimocuarto", "Decimoquinto", "Decimosexto", "Decimoséptimo", "Decimoctavo", "Decimonoveno", "Vigésimo"
]

export const getHelperCollaboratorText = indexCollaborator => {
  if (indexCollaborator === 0) return "Ingresa el nombre del Compositor como quieras que aparezca en las DSP's. Si o sí, tiene que haber al menos un Compositor.";
  if (indexCollaborator === 1) return "Ingresa el nombre del Liricista como quieras que aparezca en las DSP's. Si o sí, tiene que haber al menos un Liricista.";
  if (indexCollaborator === 2) return "Ingresa el nombre como quieras que aparezca en las DSP's. Dejar vacío si no quieres agregarlo. ";
  return "";
}

export const releaseDateInfoTooltip = ["Elije la fecha en la que este lanzamiento será publicado en las DSPs.",
  "Para lanzamientos programados recomendamos 10 días de anticipación."
]