
import { Grid, IconButton, CircularProgress, Fab, Typography } from '@mui/material';
import { Delete, Edit, Check, AddCircle, Settings } from '@mui/icons-material/';
import { getStateColor } from 'utils/albums.utils';
import { secondsToMmSs } from './timeRelated.utils';
import { getOurStateFromFugaState } from 'utils/albums.utils';

export const trackUploadProgress = (progressTrack, buttonSuccessStyle) => {
  return (
    progressTrack < 100
      ? <CircularProgress variant="determinate" value={progressTrack} size={24} />
      : <Fab aria-label="uploadSucces" color="primary" sx={buttonSuccessStyle} component="span">
        <Check size={24} />
      </Fab>
  )
}

export const moreInfoActionRender = (userId, handleMorInfo) => {
  return <IconButton onClick={() => handleMorInfo(userId)} aria-label="Ir al elemento" target="_blank">
    <AddCircle />
  </IconButton>
}

export const moreInfoAlbumRender = albumId => {
  let targetOriginUrl = window.location.origin === "http://localhost:3001" ? "http://localhost:3001" : "https://app.laflota.com.ar";
  return <IconButton href={`${targetOriginUrl}/admin/albums/${albumId}`} aria-label="Ir al elemento" target="_blank">
    <AddCircle />
  </IconButton>
}

export const iconOpenActions = (albumId, setOpenActionsDialog) => {
  return <IconButton onClick={() => setOpenActionsDialog({ open: true, albumId: albumId })}>
    <Settings />
  </IconButton>
}

export const deleteAction = (track, handleDeleteTrack) => {
  return (
    <Grid item xs={6}>
      <IconButton color="inherit" size="small" onClick={() => handleDeleteTrack(track)}>
        <Delete fontSize="inherit" />
      </IconButton>
    </Grid>
  );
};

export const editAction = (track, handleEditTrack) => {
  return (
    <Grid item xs={12}>
      <IconButton color="inherit" size="small" onClick={() => handleEditTrack(track)}>
        <Edit fontSize="inherit" />
      </IconButton>
    </Grid>
  )
};

export const getTracksAsDataTable = (tracksTotalInfo, handleEditTrack, handleDeleteTrack) => {
  return tracksTotalInfo.map(trackWithAllInfo => [
    `${trackWithAllInfo.position}`,
    `${trackWithAllInfo.title}`,
    `${trackWithAllInfo.isrc}`,
    editAction(trackWithAllInfo, handleEditTrack),
    deleteAction(trackWithAllInfo, handleDeleteTrack),
    trackUploadProgress(trackWithAllInfo.progress),
  ]);
}


export const getAlbumsPropsForUsersDataTable = albums => {
  let albumDataTable = [];
  albums.forEach(album => {
    albumDataTable.push([
      album.title,
      album.nombreArtist,
      album.upc || "",
      album.format,
      `${album.dayOfMonth}/${album.month}/${album.year}`,
    ])
  });
  return albumDataTable;
}

const getStateInfo = (sx, state) => {
  if (state === "DELIVERED_NEED_APPLE_REVISION") return (
    <Grid>
      <Typography sx={sx}>Ya se encuentra en las DSPs</Typography>
      <Typography sx={{ color: "rgb(231, 190, 66)", fontSize: "1em", fontWeight: 600 }}>Apple en revisión</Typography>
    </Grid>
  )
  else
    return <Typography sx={sx} > {state ? getOurStateFromFugaState(state) : "Ir al Album para ver el Estado"}</Typography>
}

export const getAlbumsPropsForAdminDataTable = (albums, handleOpenUserDialog, handleGoToAlbum, setOpenActionsDialog) => {
  let albumDataTable = [];
  albums.forEach(album => {
    const stateInfoStyle = { color: getStateColor(album.state ? album.state : ""), fontSize: "1em", fontWeight: 600 };
    albumDataTable.push([
      iconOpenActions(album.id, setOpenActionsDialog),
      moreInfoAlbumRender(album.id, handleGoToAlbum),
      album.title,
      album.nombreArtist,
      getStateInfo(stateInfoStyle, album.state),
      moreInfoActionRender(album.ownerId, handleOpenUserDialog),
      album.upc || "",
      album.format,
      `${album.dayOfMonth}/${album.month}/${album.year}`,
    ])
  });
  return albumDataTable;
}

export const getTracksDataTableFromFugaAssets = (fugaTracksAssets, handleEditTrack, handleDeleteTrack) => {
  let tracksDataTable = [];
  fugaTracksAssets.forEach(fugaTrackAsset => {
    tracksDataTable.push([
      fugaTrackAsset.sequence,
      fugaTrackAsset.name,
      fugaTrackAsset.isrc,
      fugaTrackAsset.display_artist,
      secondsToMmSs(fugaTrackAsset.duration),
      // editAction(fugaTrackAsset, handleEditTrack),
      // deleteAction(fugaTrackAsset, handleDeleteTrack),
    ])
  });
  return tracksDataTable;
}