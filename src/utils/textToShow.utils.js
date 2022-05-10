import Danger from 'components/Typography/Danger.js';
import Warning from 'components/Typography/Warning';
import { Link } from '@mui/material';

export const publicationDateWarning = [
  "Elegí la fecha en la que querés que este lanzamiento sea publicado en las DSPs.Si elegís la fecha de hoy, o mañana, no significa que tu lanzamiento va a estar disponible inmediatamente.Se procesará con la fecha que seleccionaste pero según la demanda, los lanzamientos pueden demorar hasta 1 - 2 días en aprobarse y procesarse, a la vez las DSPs tienen tiempos variables, y por último puede haber errores o que necesitemos corregir aspectos de tu lanzamiento.",
  < br />, "Por lo que: Si es muy importante que tu álbum se publique en una fecha exacta del futuro(por ej, para una campaña promocional), recomendamos trabajar y seleccionar una fecha con al menos 14 días de anticipación, en la cual podemos asegurarte que estará disponible en la mayoría de las DSPs principales a la vez.",
  < br />, "Si es tu primer lanzamiento(y aún no tenés perfil en las DSPs) recomendamos que elijas una fecha de acá a 5 - 7 días en el futuro para que tu perfil se cree correctamente.",
];

export const titleInvalidOldReleaseDate = "Fecha de publicación original inválida:";
export const titleInvalidPreCompraDate = "Fecha de pre-compra inválida:";

export const invalidDateContentText = [<Danger>La fecha debe ser menor a la actual fecha de lanzamiento.</Danger>,
<Danger>Por favor, vuelve a seleccionar la fecha indicadada.</Danger>]

export const noTracksWarningTitle = "No puedes crear un lanzamiento sin canciones:";
export const noTracksWarningText = [<Danger>Por favor, ingresa en la tabla las canciones del lanzamiento.</Danger>];

export const noDateRelease = "Falta seleccionar la fecha del lanzamiento:";
export const noDateWarningText = [<Danger>Por favor, ingresa el día, mes y año del lanzamiento.</Danger>];

export const singleTrackDifferentNamesTitle = "Un Single no puede tener un nombre distinto al nombre de la única canción";
export const singleTrackDifferentNamesText = [<p style={{ fontSize: '16px', color: '#f44336' }}>Al ser un lanzamiento de una sola canción, el nombre debe ser igual al de la canción</p>,
  "Nosotros corregiremos eso. Por lo que el nombre del lanzamiento será igual al nombre de la canción.",
  "La carga del lanzamiento comenzará automáticamente."
]

export const noCoverTitle = "Falta el Arte de Tapa. Si aún asi la vez, cárgala nuevamente";
export const noCoverWarningText = [<Danger>Por favor, vuelve a seleccionar un Arte de Tapa.</Danger>];

export const featuringArtistTooltip = [
  "Indica si el Artista será Principal o Featuring.",
  "Presionar para más información."
]

export const maxArtistsText = [
  <Warning>{`Ya tienes el máximo número de Artistas que tu Plan te permite.`}</Warning>,
  <Link href="https://www.laflota.com.ar/dashboard/contrasena-perdida/" target="_blank" variant="body2" underline="hover">
    Ingresa a www.laflota.com.ar para aumentar tu plan.
  </Link>,
]

export const needAdminPermissionsText = ["No puedes realizar esta acción, no tienes permisos de Administrador."]

export const infoSpotifyUri = [
  "Ingresa el código URi de Spotify.", <br />,
  "Ejemplo: spotify:artist:1JTD8FzXyY8Pk3lX1FIkpG", <br />,
  "Haz click para más información."
];

export const spotifyUriNotValidText = [
  "El formato del Spotify Uri es inválido.", <br />,
  "Formato: ", <b>spotify:artist:2ERtLJTrO8RXGMAEYOJeQc</b>, < br />,
  "que contiene exactamente 37 caracteres. Dejar vacío si no lo conoces."
]

export const spotifyUriNotValidTextDialog = [
  "El formato del Spotify Uri es inválido.",
  <p>Formato: </p>, <b>spotify:artist:2ERtLJTrO8RXGMAEYOJeQc</b>,
  "que contiene exactamente 37 caracteres.",
  "Dejar vacío si no lo conoces."
]

export const infoHelperTextAppleId = [
  "Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo.", <br />,
  "Podes encontrarla en tu perfil en iTunes(son los últimos dígitos de la URL de tu perfil)."
]

export const appleCriteriaTitle = "Has seleccionado Apple Music";

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
  "El archivo debe ser JPG de colores RGB de mínimo 3000 * 3000px y un máximo de 6000px * 6000px y siempre debe ser CUADRADA", < br />,
  "(si necesitás ayuda consultá a tu diseñador o avisanos y te recomendamos diseñadores que trabajan con nosotros)."
]

export const deleteAlbumDialogText = "Confirma que quieres eliminar el Lanzamiento. Se eliminarán todas las canciones que lo componen y se dará de baja de todas las DSPs.";

export const getNumeracionOrdinalFromIndex = [
  "Primer", "Segundo", "Tercer", "Cuarto", "Quinto", "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo", "Duodécimo", "Decimotercer",
  "Decimocuarto", "Decimoquinto", "Decimosexto", "Decimoséptimo", "Decimoctavo", "Decimonoveno", "Vigésimo"
]

export const getHelperCollaboratorText = indexCollaborator => {
  if (indexCollaborator === 0) return "Ingresa el nombre (solo uno, si quieres agregar más, haz click en el checkbox de abajo) del Compositor/a/x como quieras que aparezca en las DSPs. Si o sí, tiene que haber al menos un Compositor.";
  if (indexCollaborator === 1) return "Ingresa el nombre (solo uno, si quieres agregar más, haz click en el checkbox de abajo) del Liricista como quieras que aparezca en las DSPs. Si o sí, tiene que haber al menos un Liricista.";
  if (indexCollaborator === 2) return "Ingresa el nombre (solo uno, si quieres agregar más, haz click en el checkbox de abajo) como quieras que aparezca en las DSPs. Dejar vacío si no quieres agregarlo. ";
  return "";
}

export const releaseDateInfoTooltip = ["Elije la fecha en la que este lanzamiento será publicado en las DSPs.",
  "Para lanzamientos programados recomendamos 10 días de anticipación."
]

export const bienvenidoDialogText = [
  "Por favor, aguarda unos instantes mientras enlazamos tus Artistas cargados en el sistema anterior.",
  "A partir de ahora podes crear, editar, publicar y gestionar tu arte y trabajo desde un sólo lugar! Los lanzamientos creados anteriormente los podes encontrar en el panel anterior, hasta que terminamos la migración.",
  "Esperamos que les guste ♡", <br />, <br />, "Equipo de La Flota"
];

export const imageConstraintsMessage = [
  "La imagen debe ser formato JPG, CUADRADA y debe tener una resolucion mínima de 3000*3000 píxeles",
  " y una resolución máxima de 6000*6000 píxeles con un tamaño máximo de 20mb"
]

export const textLowQualityAudio = [
  "El archivo de audio tiene una calidad muy baja.",
  "Debe tener formato WAV, stereo, de 16, 24, o 32 bits y con un Sample Rate entre 44.1 y 192 kHz."
]

export const textFloatingPointAudio = [
  "Archivos Floating point WAV no son soportados.",
  "Debe tener formato WAV, stereo, de 16, 24, o 32 bits y con un Sample Rate entre 44.1 y 192 kHz"
]

export const filesMissingTitle = 'Archivos de audio faltantes';
export const publishedSuccessTitle = 'Tu lanzamiento ya se encuentra aprobado y listo para ser entregado a las DSPs';
export const deliveredSuccessTitle = 'Tu lanzamiento ya está en camino a las DSPs';
export const errorDeliveredTitle = 'Hubo un error al publicar el lanzamiento';

export const filesMissingText = filesMissing => {
  let trackNamesString = "";
  filesMissing.forEach((track, index) => {
    if (index === filesMissing.length - 1) trackNamesString = trackNamesString + track.title
    else trackNamesString = trackNamesString + track.title + ", "
  });

  return [
    <Warning sxOverride={{ fontSize: '18px', fontWeigth: '600' }}>
      {'Tu lanzamiento se ha generado en nuestra plataforma, pero hubo errores al subir los archivos de audio para las siguientes canciones:'}
    </Warning>, <br />,
    <b>{trackNamesString}</b>, <br />,
    "Por favor, envía los archivos de las canciones que mencionamos al siguiente link de WeTransfer, ",
    "que el nombre de cada archivo se corresponda con el nombre de la canción ",
    "y el título del mensaje sea el nombre del Lanzamiento", <br />,
    <Link
      sx={{ fontSize: '18px', fontWeigth: '600' }}
      href="https://wetransfer.com/?to=info@laflota.com.ar"
      target="_blank"
      variant="body2"
      underline="hover">
      WeTransfer
    </Link>,
  ]
}

export const publishedSuccessText = ['Tu lanzamiento se ha publicado correctamente, pronto estará en camino a las DSPs'];
export const deliveredSuccessText = ['Tu lanzamiento ya se encuentra en camino a las DPSs, este proceso puede durar de 1 a 5 días hábiles'];
export const errorDeliveredText = ["Tu lanzamiento ya se encuentra en etapa de de revisión"];

export const warningAppleDelivery = [
  "Si quieres que tu música sea enviada a Apple Music,", <br />,
  "el lanzamiento debe cumplir con ciertos requisitos,", <br />,
  "y el tiempo de aprobación si no cumple las normas puede ser mayor", <br />,
  // <br />,
  // "Haz click para más información sobre los requisitos."
]

export const subtitleEditUPC = [
  "Este cambio claramente no genera un Redelivery, ", <br />,
  "ya que no debería estar en Delivery si podemos cambiar el UPC.", <br />,
  "Se supone que sólo debemos agregar o editar un UPC cuando por algun motivo,",
  "el UPC que aparece en la APP no concuerda con el de FUGA.", <br />,
  <b>{'El cambio solo impacta a nivel de la APP'}</b>]

export const subtitleEditFugaId = ["Útil para cuando creamos por nuestra cuenta un lanzamiento en FUGA ", <br />,
  "y el lanzamiento que se ve en la APP no esta enlazado a ese Lanzamiento."]  