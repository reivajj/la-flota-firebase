export const planesLaFlota = [
  { id: "charly-garcia", name: "Charly García", maxArtists: 1 },
  { id: "fito-paez:dos-en-la-ciudad", name: "Fito Páez : Dos en la ciudad", maxArtists: 2 },
  { id: "spinettalandia-5", name: "Spinettalandia · 5 Artistas", maxArtists: 5 },
  { id: "jardin-de-gente-10", name: "Jardín de Gente · 10 Artistas", maxArtists: 10 },
]

export const subscriptionsStatusLaFlota = [
  { id: "PENDIENTE", name: "Pendiente de pago" },
  { id: "ACTIVA", name: "Activa" },
  { id: "CANCELADA", name: "Cancelada" },
  { id: "EN_ESPERA", name: "En espera" }
]

export const colorFromSubIdState = {
  CANCELADA: "rgb(224, 9, 9)",
  EN_ESPERA: "rgb(231, 190, 66)",
  ACTIVA: "rgb(10, 109, 15)",
  PENDIENTE: "rgb(231, 190, 66)",
}

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

export const ourAlbumStateWithEquivalence = {
  PENDING: "Pendiente de revisión",
  PUBLISHED: "Aprobado, pronto para delivery",
  DELIVERED: "Ya se encuentra en las DSPs",
  TAKEN_DOWN: "Dado de baja en las DSPs",
  DELETED: "Eliminado de las DSPs"
}

export const colorFromFugaState = {
  PENDING: "rgb(231, 190, 66)",
  PUBLISHED: "rgb(64, 68, 46)",
  DELIVERED: "rgb(93, 109, 15)",
  TAKEN_DOWN: "rgb(170, 3, 3)",
  DELETED: "rgb(111, 2, 2)",
}

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

export const languagesFuga = [
  {
    "id": "ES",
    "name": "Spanish"
  },
  {
    "id": "EN",
    "name": "English"
  },
  {
    "id": "AA",
    "name": "Afar"
  },
  {
    "id": "AB",
    "name": "Abkhazian"
  },
  {
    "id": "AE",
    "name": "Avestan"
  },
  {
    "id": "AF",
    "name": "Afrikaans"
  },
  {
    "id": "AK",
    "name": "Akan"
  },
  {
    "id": "AM",
    "name": "Amharic"
  },
  {
    "id": "AN",
    "name": "Aragonese"
  },
  {
    "id": "AR",
    "name": "Arabic"
  },
  {
    "id": "AS",
    "name": "Assamese"
  },
  {
    "id": "AV",
    "name": "Avaric"
  },
  {
    "id": "AY",
    "name": "Aymara"
  },
  {
    "id": "AZ",
    "name": "Azerbaijani"
  },
  {
    "id": "BA",
    "name": "Bashkir"
  },
  {
    "id": "BE",
    "name": "Belarusian"
  },
  {
    "id": "BG",
    "name": "Bulgarian"
  },
  {
    "id": "BHO",
    "name": "Bhojpuri"
  },
  {
    "id": "BI",
    "name": "Bislama"
  },
  {
    "id": "BM",
    "name": "Bambara"
  },
  {
    "id": "BN",
    "name": "Bengali"
  },
  {
    "id": "BO",
    "name": "Tibetan"
  },
  {
    "id": "BR",
    "name": "Breton"
  },
  {
    "id": "BS",
    "name": "Bosnian"
  },
  {
    "id": "CA",
    "name": "Catalan"
  },
  {
    "id": "CE",
    "name": "Chechen"
  },
  {
    "id": "CH",
    "name": "Chamorro"
  },
  {
    "id": "CMN_HANS",
    "name": "Chinese (Simplified)"
  },
  {
    "id": "CMN_HANT",
    "name": "Chinese (Traditional)"
  },
  {
    "id": "CO",
    "name": "Corsican"
  },
  {
    "id": "CPE",
    "name": "Creole, English based"
  },
  {
    "id": "CPF",
    "name": "Creole, French based"
  },
  {
    "id": "CPP",
    "name": "Creole, Portuguese based"
  },
  {
    "id": "CR",
    "name": "Cree"
  },
  {
    "id": "CS",
    "name": "Czech"
  },
  {
    "id": "CU",
    "name": "Church Slavic"
  },
  {
    "id": "CV",
    "name": "Chuvash"
  },
  {
    "id": "CY",
    "name": "Welsh"
  },
  {
    "id": "DA",
    "name": "Danish"
  },
  {
    "id": "DE",
    "name": "German"
  },
  {
    "id": "DV",
    "name": "Divehi"
  },
  {
    "id": "DZ",
    "name": "Dzongkha"
  },
  {
    "id": "EE",
    "name": "Ewe"
  },
  {
    "id": "EL",
    "name": "Greek"
  },
  {
    "id": "EO",
    "name": "Esperanto"
  },
  {
    "id": "ET",
    "name": "Estonian"
  },
  {
    "id": "EU",
    "name": "Basque"
  },
  {
    "id": "FA",
    "name": "Persian"
  },
  {
    "id": "FF",
    "name": "Fulah"
  },
  {
    "id": "FI",
    "name": "Finnish"
  },
  {
    "id": "FJ",
    "name": "Fijian"
  },
  {
    "id": "FO",
    "name": "Faroese"
  },
  {
    "id": "FR",
    "name": "French"
  },
  {
    "id": "FY",
    "name": "Western Frisian"
  },
  {
    "id": "GA",
    "name": "Irish"
  },
  {
    "id": "GD",
    "name": "Gaelic"
  },
  {
    "id": "GL",
    "name": "Galician"
  },
  {
    "id": "GN",
    "name": "Guarani"
  },
  {
    "id": "GU",
    "name": "Gujarati"
  },
  {
    "id": "GV",
    "name": "Manx"
  },
  {
    "id": "HA",
    "name": "Hausa"
  },
  {
    "id": "HAT",
    "name": "Haitian Creole"
  },
  {
    "id": "HE",
    "name": "Hebrew"
  },
  {
    "id": "HI",
    "name": "Hindi"
  },
  {
    "id": "HO",
    "name": "Hiri Motu"
  },
  {
    "id": "HR",
    "name": "Croatian"
  },
  {
    "id": "HT",
    "name": "Haitian"
  },
  {
    "id": "HU",
    "name": "Hungarian"
  },
  {
    "id": "HY",
    "name": "Armenian"
  },
  {
    "id": "HZ",
    "name": "Herero"
  },
  {
    "id": "IA",
    "name": "Interlingua"
  },
  {
    "id": "ID",
    "name": "Indonesian"
  },
  {
    "id": "IE",
    "name": "Interlingue"
  },
  {
    "id": "IG",
    "name": "Igbo"
  },
  {
    "id": "II",
    "name": "Sichuan Yi"
  },
  {
    "id": "IK",
    "name": "Inupiaq"
  },
  {
    "id": "IO",
    "name": "Ido"
  },
  {
    "id": "IS",
    "name": "Icelandic"
  },
  {
    "id": "IT",
    "name": "Italian"
  },
  {
    "id": "IU",
    "name": "Inuktitut"
  },
  {
    "id": "JA",
    "name": "Japanese"
  },
  {
    "id": "JA_KANA",
    "name": "Japanese Katakana"
  },
  {
    "id": "JA_LATN",
    "name": "Japanese Roman"
  },
  {
    "id": "JV",
    "name": "Javanese"
  },
  {
    "id": "KA",
    "name": "Georgian"
  },
  {
    "id": "KG",
    "name": "Kongo"
  },
  {
    "id": "KI",
    "name": "Kikuyu"
  },
  {
    "id": "KJ",
    "name": "Kuanyama"
  },
  {
    "id": "KK",
    "name": "Kazakh"
  },
  {
    "id": "KL",
    "name": "Kalaallisut"
  },
  {
    "id": "KM",
    "name": "Central Khmer"
  },
  {
    "id": "KN",
    "name": "Kannada"
  },
  {
    "id": "KO",
    "name": "Korean"
  },
  {
    "id": "KR",
    "name": "Kanuri"
  },
  {
    "id": "KS",
    "name": "Kashmiri"
  },
  {
    "id": "KU",
    "name": "Kurdish"
  },
  {
    "id": "KV",
    "name": "Komi"
  },
  {
    "id": "KW",
    "name": "Cornish"
  },
  {
    "id": "KY",
    "name": "Kirghiz"
  },
  {
    "id": "LA",
    "name": "Latin"
  },
  {
    "id": "LB",
    "name": "Luxembourgish"
  },
  {
    "id": "LG",
    "name": "Luganda"
  },
  {
    "id": "LI",
    "name": "Limburgan"
  },
  {
    "id": "LN",
    "name": "Lingala"
  },
  {
    "id": "LO",
    "name": "Lao"
  },
  {
    "id": "LT",
    "name": "Lithuanian"
  },
  {
    "id": "LU",
    "name": "Luba-Katanga"
  },
  {
    "id": "LV",
    "name": "Latvian"
  },
  {
    "id": "MG",
    "name": "Malagasy"
  },
  {
    "id": "MAG",
    "name": "Magahi"
  },
  {
    "id": "MAI",
    "name": "Maithili"
  },
  {
    "id": "MH",
    "name": "Marshallese"
  },
  {
    "id": "MI",
    "name": "Maori"
  },
  {
    "id": "MK",
    "name": "Macedonian"
  },
  {
    "id": "ML",
    "name": "Malayalam"
  },
  {
    "id": "MN",
    "name": "Mongolian"
  },
  {
    "id": "MR",
    "name": "Marathi"
  },
  {
    "id": "MS",
    "name": "Malay"
  },
  {
    "id": "MT",
    "name": "Maltese"
  },
  {
    "id": "MY",
    "name": "Burmese"
  },
  {
    "id": "NA",
    "name": "Nauru"
  },
  {
    "id": "NB",
    "name": "Norwegian Bokmål"
  },
  {
    "id": "ND",
    "name": "North Ndebele"
  },
  {
    "id": "NE",
    "name": "Nepali"
  },
  {
    "id": "NG",
    "name": "Ndonga"
  },
  {
    "id": "NL",
    "name": "Dutch"
  },
  {
    "id": "NN",
    "name": "Norwegian Nynorsk"
  },
  {
    "id": "NO",
    "name": "Norwegian"
  },
  {
    "id": "NR",
    "name": "South Ndebele"
  },
  {
    "id": "NV",
    "name": "Navajo"
  },
  {
    "id": "NY",
    "name": "Chichewa"
  },
  {
    "id": "OC",
    "name": "Occitan"
  },
  {
    "id": "OJ",
    "name": "Ojibwa"
  },
  {
    "id": "OM",
    "name": "Oromo"
  },
  {
    "id": "OR",
    "name": "Oriya"
  },
  {
    "id": "OS",
    "name": "Ossetian"
  },
  {
    "id": "PA",
    "name": "Punjabi"
  },
  {
    "id": "PI",
    "name": "Pali"
  },
  {
    "id": "PL",
    "name": "Polish"
  },
  {
    "id": "PS",
    "name": "Pushto"
  },
  {
    "id": "PT",
    "name": "Portuguese"
  },
  {
    "id": "QU",
    "name": "Quechua"
  },
  {
    "id": "RM",
    "name": "Romansh"
  },
  {
    "id": "RN",
    "name": "Rundi"
  },
  {
    "id": "RO",
    "name": "Romanian"
  },
  {
    "id": "RU",
    "name": "Russian"
  },
  {
    "id": "RW",
    "name": "Kinyarwanda"
  },
  {
    "id": "SA",
    "name": "Sanskrit"
  },
  {
    "id": "SC",
    "name": "Sardinian"
  },
  {
    "id": "SD",
    "name": "Sindhi"
  },
  {
    "id": "SE",
    "name": "Northern Sami"
  },
  {
    "id": "SG",
    "name": "Sango"
  },
  {
    "id": "SI",
    "name": "Sinhala"
  },
  {
    "id": "SK",
    "name": "Slovak"
  },
  {
    "id": "SL",
    "name": "Slovene"
  },
  {
    "id": "SM",
    "name": "Samoan"
  },
  {
    "id": "SN",
    "name": "Shona"
  },
  {
    "id": "SO",
    "name": "Somali"
  },
  {
    "id": "SQ",
    "name": "Albanian"
  },
  {
    "id": "SR",
    "name": "Serbian"
  },
  {
    "id": "SS",
    "name": "Swati"
  },
  {
    "id": "ST",
    "name": "Sotho, Southern"
  },
  {
    "id": "SU",
    "name": "Sundanese"
  },
  {
    "id": "SV",
    "name": "Swedish"
  },
  {
    "id": "SW",
    "name": "Swahili"
  },
  {
    "id": "TA",
    "name": "Tamil"
  },
  {
    "id": "TE",
    "name": "Telugu"
  },
  {
    "id": "TG",
    "name": "Tajik"
  },
  {
    "id": "TH",
    "name": "Thai"
  },
  {
    "id": "TI",
    "name": "Tigrinya"
  },
  {
    "id": "TK",
    "name": "Turkmen"
  },
  {
    "id": "TL",
    "name": "Tagalog"
  },
  {
    "id": "TN",
    "name": "Tswana"
  },
  {
    "id": "TO",
    "name": "Tonga (Tonga Islands)"
  },
  {
    "id": "TR",
    "name": "Turkish"
  },
  {
    "id": "TS",
    "name": "Tsonga"
  },
  {
    "id": "TT",
    "name": "Tatar"
  },
  {
    "id": "TW",
    "name": "Twi"
  },
  {
    "id": "TY",
    "name": "Tahitian"
  },
  {
    "id": "UG",
    "name": "Uighur"
  },
  {
    "id": "UK",
    "name": "Ukrainian"
  },
  {
    "id": "UR",
    "name": "Urdu"
  },
  {
    "id": "UZ",
    "name": "Uzbek"
  },
  {
    "id": "VE",
    "name": "Venda"
  },
  {
    "id": "VI",
    "name": "Vietnamese"
  },
  {
    "id": "VO",
    "name": "Volapük"
  },
  {
    "id": "WA",
    "name": "Walloon"
  },
  {
    "id": "WO",
    "name": "Wolof"
  },
  {
    "id": "XH",
    "name": "Xhosa"
  },
  {
    "id": "YI",
    "name": "Yiddish"
  },
  {
    "id": "YUE_HANT",
    "name": "Cantonese"
  },
  {
    "id": "YO",
    "name": "Yoruba"
  },
  {
    "id": "ZA",
    "name": "Zhuang"
  },
  {
    "id": "ZH",
    "name": "Chinese"
  },
  {
    "id": "ZU",
    "name": "Zulu"
  }
]

export const allAudioLocalesFuga = [
  {
    "id": "ZXX",
    "name": "Instrumental"
  },
  {
    "id": "AA",
    "name": "Afar"
  },
  {
    "id": "AB",
    "name": "Abkhazian"
  },
  {
    "id": "AE",
    "name": "Avestan"
  },
  {
    "id": "AF",
    "name": "Afrikaans"
  },
  {
    "id": "AK",
    "name": "Akan"
  },
  {
    "id": "AM",
    "name": "Amharic"
  },
  {
    "id": "AN",
    "name": "Aragonese"
  },
  {
    "id": "AR",
    "name": "Arabic"
  },
  {
    "id": "AS",
    "name": "Assamese"
  },
  {
    "id": "AV",
    "name": "Avaric"
  },
  {
    "id": "AY",
    "name": "Aymara"
  },
  {
    "id": "AZ",
    "name": "Azerbaijani"
  },
  {
    "id": "BA",
    "name": "Bashkir"
  },
  {
    "id": "BE",
    "name": "Belarusian"
  },
  {
    "id": "BG",
    "name": "Bulgarian"
  },
  {
    "id": "BHO",
    "name": "Bhojpuri"
  },
  {
    "id": "BI",
    "name": "Bislama"
  },
  {
    "id": "BM",
    "name": "Bambara"
  },
  {
    "id": "BN",
    "name": "Bengali"
  },
  {
    "id": "BO",
    "name": "Tibetan"
  },
  {
    "id": "BR",
    "name": "Breton"
  },
  {
    "id": "BS",
    "name": "Bosnian"
  },
  {
    "id": "CA",
    "name": "Catalan"
  },
  {
    "id": "CE",
    "name": "Chechen"
  },
  {
    "id": "CH",
    "name": "Chamorro"
  },
  {
    "id": "CO",
    "name": "Corsican"
  },
  {
    "id": "CPE",
    "name": "Creole, English based"
  },
  {
    "id": "CPF",
    "name": "Creole, French based"
  },
  {
    "id": "CPP",
    "name": "Creole, Portuguese based"
  },
  {
    "id": "CR",
    "name": "Cree"
  },
  {
    "id": "CS",
    "name": "Czech"
  },
  {
    "id": "CU",
    "name": "Church Slavic"
  },
  {
    "id": "CV",
    "name": "Chuvash"
  },
  {
    "id": "CY",
    "name": "Welsh"
  },
  {
    "id": "DA",
    "name": "Danish"
  },
  {
    "id": "DE",
    "name": "German"
  },
  {
    "id": "DV",
    "name": "Divehi"
  },
  {
    "id": "DZ",
    "name": "Dzongkha"
  },
  {
    "id": "EE",
    "name": "Ewe"
  },
  {
    "id": "EL",
    "name": "Greek"
  },
  {
    "id": "EN",
    "name": "English"
  },
  {
    "id": "EO",
    "name": "Esperanto"
  },
  {
    "id": "ES",
    "name": "Spanish"
  },
  {
    "id": "ET",
    "name": "Estonian"
  },
  {
    "id": "EU",
    "name": "Basque"
  },
  {
    "id": "FA",
    "name": "Persian"
  },
  {
    "id": "FF",
    "name": "Fulah"
  },
  {
    "id": "FI",
    "name": "Finnish"
  },
  {
    "id": "FJ",
    "name": "Fijian"
  },
  {
    "id": "FO",
    "name": "Faroese"
  },
  {
    "id": "FR",
    "name": "French"
  },
  {
    "id": "FY",
    "name": "Western Frisian"
  },
  {
    "id": "GA",
    "name": "Irish"
  },
  {
    "id": "GD",
    "name": "Gaelic"
  },
  {
    "id": "GL",
    "name": "Galician"
  },
  {
    "id": "GN",
    "name": "Guarani"
  },
  {
    "id": "GU",
    "name": "Gujarati"
  },
  {
    "id": "GV",
    "name": "Manx"
  },
  {
    "id": "HA",
    "name": "Hausa"
  },
  {
    "id": "HAT",
    "name": "Haitian Creole"
  },
  {
    "id": "HE",
    "name": "Hebrew"
  },
  {
    "id": "HI",
    "name": "Hindi"
  },
  {
    "id": "HO",
    "name": "Hiri Motu"
  },
  {
    "id": "HR",
    "name": "Croatian"
  },
  {
    "id": "HT",
    "name": "Haitian"
  },
  {
    "id": "HU",
    "name": "Hungarian"
  },
  {
    "id": "HY",
    "name": "Armenian"
  },
  {
    "id": "HZ",
    "name": "Herero"
  },
  {
    "id": "IA",
    "name": "Interlingua"
  },
  {
    "id": "ID",
    "name": "Indonesian"
  },
  {
    "id": "IE",
    "name": "Interlingue"
  },
  {
    "id": "IG",
    "name": "Igbo"
  },
  {
    "id": "II",
    "name": "Sichuan Yi"
  },
  {
    "id": "IK",
    "name": "Inupiaq"
  },
  {
    "id": "IO",
    "name": "Ido"
  },
  {
    "id": "IS",
    "name": "Icelandic"
  },
  {
    "id": "IT",
    "name": "Italian"
  },
  {
    "id": "IU",
    "name": "Inuktitut"
  },
  {
    "id": "JA",
    "name": "Japanese"
  },
  {
    "id": "JV",
    "name": "Javanese"
  },
  {
    "id": "KA",
    "name": "Georgian"
  },
  {
    "id": "KG",
    "name": "Kongo"
  },
  {
    "id": "KI",
    "name": "Kikuyu"
  },
  {
    "id": "KJ",
    "name": "Kuanyama"
  },
  {
    "id": "KK",
    "name": "Kazakh"
  },
  {
    "id": "KL",
    "name": "Kalaallisut"
  },
  {
    "id": "KM",
    "name": "Central Khmer"
  },
  {
    "id": "KN",
    "name": "Kannada"
  },
  {
    "id": "KO",
    "name": "Korean"
  },
  {
    "id": "KR",
    "name": "Kanuri"
  },
  {
    "id": "KS",
    "name": "Kashmiri"
  },
  {
    "id": "KU",
    "name": "Kurdish"
  },
  {
    "id": "KV",
    "name": "Komi"
  },
  {
    "id": "KW",
    "name": "Cornish"
  },
  {
    "id": "KY",
    "name": "Kirghiz"
  },
  {
    "id": "LA",
    "name": "Latin"
  },
  {
    "id": "LB",
    "name": "Luxembourgish"
  },
  {
    "id": "LG",
    "name": "Luganda"
  },
  {
    "id": "LI",
    "name": "Limburgan"
  },
  {
    "id": "LN",
    "name": "Lingala"
  },
  {
    "id": "LO",
    "name": "Lao"
  },
  {
    "id": "LT",
    "name": "Lithuanian"
  },
  {
    "id": "LU",
    "name": "Luba-Katanga"
  },
  {
    "id": "LV",
    "name": "Latvian"
  },
  {
    "id": "MAG",
    "name": "Magahi"
  },
  {
    "id": "MAI",
    "name": "Maithili"
  },
  {
    "id": "MG",
    "name": "Malagasy"
  },
  {
    "id": "MH",
    "name": "Marshallese"
  },
  {
    "id": "MI",
    "name": "Maori"
  },
  {
    "id": "MK",
    "name": "Macedonian"
  },
  {
    "id": "ML",
    "name": "Malayalam"
  },
  {
    "id": "MN",
    "name": "Mongolian"
  },
  {
    "id": "MR",
    "name": "Marathi"
  },
  {
    "id": "MS",
    "name": "Malay"
  },
  {
    "id": "MT",
    "name": "Maltese"
  },
  {
    "id": "MY",
    "name": "Burmese"
  },
  {
    "id": "NA",
    "name": "Nauru"
  },
  {
    "id": "NB",
    "name": "Norwegian Bokmål"
  },
  {
    "id": "ND",
    "name": "North Ndebele"
  },
  {
    "id": "NE",
    "name": "Nepali"
  },
  {
    "id": "NG",
    "name": "Ndonga"
  },
  {
    "id": "NL",
    "name": "Dutch"
  },
  {
    "id": "NN",
    "name": "Norwegian Nynorsk"
  },
  {
    "id": "NO",
    "name": "Norwegian"
  },
  {
    "id": "NR",
    "name": "South Ndebele"
  },
  {
    "id": "NV",
    "name": "Navajo"
  },
  {
    "id": "NY",
    "name": "Chichewa"
  },
  {
    "id": "OC",
    "name": "Occitan"
  },
  {
    "id": "OJ",
    "name": "Ojibwa"
  },
  {
    "id": "OM",
    "name": "Oromo"
  },
  {
    "id": "OR",
    "name": "Oriya"
  },
  {
    "id": "OS",
    "name": "Ossetian"
  },
  {
    "id": "PA",
    "name": "Punjabi"
  },
  {
    "id": "PI",
    "name": "Pali"
  },
  {
    "id": "PL",
    "name": "Polish"
  },
  {
    "id": "PS",
    "name": "Pushto"
  },
  {
    "id": "PT",
    "name": "Portuguese"
  },
  {
    "id": "QU",
    "name": "Quechua"
  },
  {
    "id": "RM",
    "name": "Romansh"
  },
  {
    "id": "RN",
    "name": "Rundi"
  },
  {
    "id": "RO",
    "name": "Romanian"
  },
  {
    "id": "RU",
    "name": "Russian"
  },
  {
    "id": "RW",
    "name": "Kinyarwanda"
  },
  {
    "id": "SA",
    "name": "Sanskrit"
  },
  {
    "id": "SC",
    "name": "Sardinian"
  },
  {
    "id": "SD",
    "name": "Sindhi"
  },
  {
    "id": "SE",
    "name": "Northern Sami"
  },
  {
    "id": "SG",
    "name": "Sango"
  },
  {
    "id": "SI",
    "name": "Sinhala"
  },
  {
    "id": "SK",
    "name": "Slovak"
  },
  {
    "id": "SL",
    "name": "Slovene"
  },
  {
    "id": "SM",
    "name": "Samoan"
  },
  {
    "id": "SN",
    "name": "Shona"
  },
  {
    "id": "SO",
    "name": "Somali"
  },
  {
    "id": "SQ",
    "name": "Albanian"
  },
  {
    "id": "SR",
    "name": "Serbian"
  },
  {
    "id": "SS",
    "name": "Swati"
  },
  {
    "id": "ST",
    "name": "Sotho, Southern"
  },
  {
    "id": "SU",
    "name": "Sundanese"
  },
  {
    "id": "SV",
    "name": "Swedish"
  },
  {
    "id": "SW",
    "name": "Swahili"
  },
  {
    "id": "TA",
    "name": "Tamil"
  },
  {
    "id": "TE",
    "name": "Telugu"
  },
  {
    "id": "TG",
    "name": "Tajik"
  },
  {
    "id": "TH",
    "name": "Thai"
  },
  {
    "id": "TI",
    "name": "Tigrinya"
  },
  {
    "id": "TK",
    "name": "Turkmen"
  },
  {
    "id": "TL",
    "name": "Tagalog"
  },
  {
    "id": "TN",
    "name": "Tswana"
  },
  {
    "id": "TO",
    "name": "Tonga (Tonga Islands)"
  },
  {
    "id": "TR",
    "name": "Turkish"
  },
  {
    "id": "TS",
    "name": "Tsonga"
  },
  {
    "id": "TT",
    "name": "Tatar"
  },
  {
    "id": "TW",
    "name": "Twi"
  },
  {
    "id": "TY",
    "name": "Tahitian"
  },
  {
    "id": "UG",
    "name": "Uighur"
  },
  {
    "id": "UK",
    "name": "Ukrainian"
  },
  {
    "id": "UR",
    "name": "Urdu"
  },
  {
    "id": "UZ",
    "name": "Uzbek"
  },
  {
    "id": "VE",
    "name": "Venda"
  },
  {
    "id": "VI",
    "name": "Vietnamese"
  },
  {
    "id": "VO",
    "name": "Volapük"
  },
  {
    "id": "WA",
    "name": "Walloon"
  },
  {
    "id": "WO",
    "name": "Wolof"
  },
  {
    "id": "XH",
    "name": "Xhosa"
  },
  {
    "id": "YI",
    "name": "Yiddish"
  },
  {
    "id": "YUE",
    "name": "Cantonese"
  },
  {
    "id": "YO",
    "name": "Yoruba"
  },
  {
    "id": "ZA",
    "name": "Zhuang"
  },
  {
    "id": "ZH",
    "name": "Chinese"
  },
  {
    "id": "ZU",
    "name": "Zulu"
  }
]
