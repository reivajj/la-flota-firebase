// Auth Types
export const EMAIL_CHANGED = 'email_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const SIGN_IN = 'sign_in';
export const SIGN_IN_ERR = 'sign_in_err';
export const SIGN_OUT = 'sign_out';
export const SIGN_OUT_ERROR = "sign_out_error";
export const SIGN_IN_POST_SIGNUP = "sign_in_post_signup";

// SignUp Types
export const SIGNUP_SUCCESS = "sign_up_succes";
export const SIGNUP_ERROR = "signup_error";
export const REVERT_SIGNUP_SUCCED = "revert_signup_succed";

// UserData Types
export const USER_DATA_EDIT_PERFIL = "user_data_edit_perfil";
export const USER_DATA_SIGN_IN = 'user_data_sign_in';
export const USER_DATA_SIGN_OUT = 'user_data_sign_out';
export const USER_DATA_ADD_IMAGE = 'user_data_add_image';
export const USER_DATA_ADD_SUBGENERO = "user_data_add_subgenero";

// Artists Types
export const ADD_ARTISTS = "add_artists";
export const ARTISTS_SIGN_OUT = "artists_sign_out";
export const ADDING_ARTIST_NAME = "adding_artist_name";
export const ADDING_ARTIST_BIO = "adding_artist_bio";
export const ADDING_ARTIST_IMAGEN_URL = "adding_artist_imagen_url";
export const ADDING_ARTIST_ID = "adding_artist_id";
export const ARTIST_DELETE_WITH_ID = "artist_delete_with_id";
export const EDIT_ARTIST_WITH_ID = "edit_artist_with_id";
export const ADDING_ARTIST_SPOTIFY_URI = "adding_artist_spotify_uri";
export const ADDING_ARTIST_APPLE_ID = "adding_artist_apple_id";

// Labels Types
export const ADD_LABELS = "add_labels";
export const LABELS_SIGN_OUT = "labels_sign_out";
export const LABEL_DELETE_WITH_ID = "label_delete_with_id";

//Albums Types
export const ADD_ALBUMS = "add_albums";
export const ALBUMS_SIGN_OUT = "albums_sign_out";
export const ALBUMS_UPDATE_ADDING_ALBUM = "albums_update_adding_album";
export const ALBUMS_CLEAN_ADDING_ALBUM = "albums_clean_adding_album";
export const ALBUMS_UPDATE_ADDING_ALBUM_IMAGEN_URL_AND_FILE = "albums_update_adding_album_imagen_url_and_file";
export const ALBUMS_UPDATE_OTHER_ARTIST_NAME = "albums_update_other_artist_name";
export const ALBUMS_UPDATE_OTHER_ARTIST_IDENTIFIER = "albums_update_other_artist_identifier";
export const ALBUMS_UPDATE_OTHER_ARTIST_PRIMARY = "albums_update_other_artist_primary";
export const ALBUMS_DELETE_BY_ID = "albums_delete_by_id";

//Tracks Types
export const ADD_TRACKS = "add_tracks";
export const ADD_UPLOADING_TRACKS = "add_uploading_tracks";
export const TRACKS_SIGN_OUT = "tracks_sign_out";
export const EDIT_TRACK = "edit_track";
export const EDIT_TRACK_POST_UPLOAD_IN_DB = "edit_track_post_upload_in_db";
export const SET_TRACK_UPLOAD_PROGRESS = "set_track_upload_progress";
export const TRACK_UPLOADING_DELETE = "track_uploading_delete";
export const TRACK_UPLOADING_EDIT = "track_uploading_edit";

// ArtistsInvited Types
export const INVITED_ARTISTS_ADD = "INVITED_ARTISTS_ADD";
export const INVITED_ARTIST_EDIT_WITH_ID = "INVITED_ARTIST_EDIT_WITH_ID";
export const INVITED_ARTIST_DELETE_WITH_ID = "invited_artist_delete_with_id";
export const INVITED_ARTISTS_SIGN_OUT = "invited_artists_sign_out";

// Collaborators Types
export const ADD_COLLABORATORS = "add_collaborators";
export const COLLABORATORS_SIGN_OUT = "collaborators_sign_out";

//ErrorHandler
export const ERROR_FROM_BACKEND = "error_from_backend";
export const ERROR_FROM_FIRESTORE = "error_from_firestore";
export const ERROR_CLEAN_LAST = "error_clean_last";
export const ERROR_BASIC_MSG = "error_basic_msg";