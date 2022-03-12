import React, { useState } from "react";
import { Grid, Typography, Card, CardContent, CardActions, IconButton, Button } from '@mui/material';
import { Image } from 'mui-image';
import { Edit } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanNameFromId, getSubscriptionStatusFromId, getSubStatusColor } from '../../utils/users.utils';
import { userIsAdmin } from 'utils/users.utils';
import NewUserDialog from './NewUserDialog';
// import AvatarUser from '../Icons/Avatar';
import ArtistAddedIcon from '../Icons/ArtistAddedIcon';


const UserCard = ({ dataUser, isOpenEditDialog, setOpenEditDialog, setOpenNotAdminWarning }) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(store => store.userData);

  const handleEditUser = () => {
    if (!userIsAdmin(currentUser.rol)) setOpenNotAdminWarning(true);
    else {
      console.log("DATA USER en CARD: ", dataUser);
      setOpenEditDialog({ open: true, action: 'edit', userId: dataUser.id });
    }
  }
  const handleGoToUserAlbums = () => navigate(`/admin/albums?view=allOfUser&id=${dataUser.id}`);
  const handleGoToUserArtists = () => navigate(`/admin/artists?view=allOfUser&id=${dataUser.id}`);

  const handleGoToUserLabels = () => {
    console.log("LABELS");
  }

  // const stringNameForAvatar = () => {
  //   let userName = dataUser.nombre + " " + dataUser.apellido;
  //   if (userName.indexOf('undefined') >= 0 || userName.trim() === "") return dataUser.email;
  //   else return userName;
  // }

  const subStatusStyle = { color: getSubStatusColor(dataUser.userStatus), fontWeight: 600, fontSize: "14px", marginTop: "1em", marginBottom: "0" };

  return (
    <>
      {isOpenEditDialog.open && isOpenEditDialog.action === "edit" && isOpenEditDialog.userId === dataUser.id &&
        <NewUserDialog isOpen={isOpenEditDialog} handleCloseDialog={() => setOpenEditDialog({ open: false, action: "none" })} userSelected={dataUser} />}

      <Card sx={cardElementStyle}>

        <CardContent sx={{ height: "45%" }}>
          <Grid item xs={12} sx={{ height: "100%" }}>
            {dataUser.imagenUrl
              ? <Image
                style={imageStyle}
                alt="artist-image"
                duration={30}
                src={dataUser.imagenUrl}
              />
              // : <AvatarUser stringName={stringNameForAvatar()} />
              : <ArtistAddedIcon sx={artistAddedIconStyle} asIconButton={false} />
            }
          </Grid>
        </CardContent>

        <CardContent style={{ padding: '6px', height: '30%' }}>
          <Grid container sx={{ textAlign: "center" }} padding={2}>

            <Grid item xs={12} textAlign="-moz-center">
              <Typography noWrap sx={cardTitleBlackStyles}>{dataUser.email}</Typography>
            </Grid>

            <Grid item xs={12} textAlign="-moz-center">
              <Divider sx={dividerStyle} />
            </Grid>

            <Grid container item xs={12} textAlign="left" sx={{ paddingTop: "1em", paddingBottom: 0, whiteSpace: "nowrap" }}>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Password: </b><b style={cardCodeTextStyle} >{`${dataUser.password ? dataUser.password : "No tenemos su clave"}`}</b>
              </Grid>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Nombre: </b><b style={cardCodeTextStyle} >{`${dataUser.nombre + " " + dataUser.apellido}`}</b>
              </Grid>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Plan: </b><b style={cardCodeTextStyle} >{getPlanNameFromId(dataUser.plan)}</b>
              </Grid>

              <Grid item xs={12} >
                <b style={cardDSPNameStyles}>Suscripción: </b><b style={subStatusStyle} >{getSubscriptionStatusFromId(dataUser.userStatus)}</b>
              </Grid>
            </Grid>


          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", height: '24%' }}>

          <Grid container spacing={1} justifyContent="center">

            <Grid container item spacing={1} xs={12}>
              <Grid item xs={6}>
                <Button
                  sx={{ width: "90%" }}
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToUserAlbums}
                >
                  Lanzamientos
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  sx={{ width: "90%" }}
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToUserArtists}
                >
                  Artistas
                </Button>
              </Grid>

            </Grid>

            <Grid container item direction="row" justifyContent="center" xs={12}>
              <Grid item xs={1}>
                <IconButton color="inherit" size="small" key="delete" onClick={handleEditUser}>
                  <Edit fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

          </Grid>
        </CardActions>

      </Card>
    </>
  );
}

export default UserCard;

const imageStyle = { borderRadius: "30px", marginTop: "7%", width: "100%", height: "100%" };
const cardElementStyle = { borderRadius: "30px", marginTop: "7%", width: "95%", height: "95%" };
const cardTitleBlackStyles = { color: "rgba(0,0,0,1)", fontWeight: "300px", fontSize: "30px", marginBottom: "3px" };
const dividerStyle = { width: "90%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const artistAddedIconStyle = { borderRadius: "30px", marginTop: "7%", width: "100%", height: "100%" };
const cardDSPNameStyles = { color: "rgba(0,0,0,0.9)", margin: "0", fontWeight: 600, fontSize: "14px", marginTop: "1em", marginBottom: "0" };
const cardCodeTextStyle = { color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "14px", marginTop: "1em", marginBottom: "0" };
