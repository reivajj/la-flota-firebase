export const languages = [
  "Spanish", "English", "None", "Afrikaans", "Arabic", "Bulgarian", "Cantonese", "Catalan", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "Estonian", "Finnish", "French",
  "German", "Greek", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Italian", "Japanese", "Kazakh", "Korean", "Lao", "Latvian", "Lithuanian",
  "Malay", "Norwegian", "Polish", "Portuguese", "Romanian", "Russian", "Slovak", "Slovenian", "Swedish", "Tagalog", "Tamil", "Telugu", "Thai",
  "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Zulu"
];

export const provincias = [
  { value: "RN", provincia: "Rio Negro" },
  { value: "BA", provincia: "Buenos Aires" },
  { value: "CABA", provincia: "Ciudad Autonoma de Buenos Aires" }
];


export const ciudades = [
  { value: "Viedma", localidad: "Viedma" },
  { value: "CABA", localidad: "CABA" },
  { value: "Patagones", localidad: "Patagones" },
  { value: "Las Grutas", localidad: "Las Grutas" }
].sort((function (cA, cB) {
  if (cA.value < cB.value) return -1;
  else return 1;
}));

export const peopleRoles = [
  'ACTOR', 'ARRANGER', 'CHOIR', 'COMPOSER', 'CONDUCTOR', 'CONTRIBUTING_ARTIST', 'ENGINEER', 'ENSEMBLE',
  'FEATURING', 'LYRICIST', 'MIXER', 'ORCHESTRA', 'PERFORMER', 'PRODUCER', 'REMIXER', 'SOLOIST', 'WRITER', 'VIDEO_DIRECTOR', 'VIDEO_PRODUCER'
]
