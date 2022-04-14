import React, { useState, useEffect } from "react";
import { Grid, Typography, Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { getSubStatusColor, getSubscriptionStatusFromId } from '../../utils/users.utils';
import { subscriptionsStatusLaFlota } from "variables/varias";
import PlanCard from "./PlanCard";
import { planesLaFlota } from '../../variables/varias';

const Subscription = () => {

  const dispatch = useDispatch();

  const userData = useSelector(store => store.userData);
  console.log("USER DATA IN SUBSCRIPTION: ", userData);
  // useEffect(() => {

  // }, [userData])
  const notActiveStatus = subscriptionsStatusLaFlota.filter(sub => sub.id !== "ACTIVA").map(sub => sub.id);

  const subStatusStyle = { color: getSubStatusColor(userData.userStatus), fontWeight: 500, fontSize: "30px", marginBottom: "0" };

  let inactiveSubscriptionText = "No tienes suscripciones activas. Encuentra tu primera suscripción en la tienda.";

  return (
    <Grid container justifyContent="center">

      <Grid item xs={12}>
        <Card>

          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Suscripción</Typography>
            <p sx={cardCategoryWhiteStyles}>Aquí verás el estado de tu suscripción a La Flota</p>
          </CardHeader>

          <CardBody>
            <Grid container justifyContent="center" textAlign="center">

              <Grid item xs={12} sx={{ marginTop: "2em" }}>
                <b style={cardDSPNameStyles}>Estado de tu cuenta: </b><b style={subStatusStyle} >{getSubscriptionStatusFromId(userData.userStatus)}</b>
              </Grid>

              {notActiveStatus.includes(userData.userStatus) && <Grid item xs={12}>
                <p style={inactiveSubscriptionWarningStyle}>{inactiveSubscriptionText}</p>
                <Link href="https://laflota.com.ar/contacto/" target="_blank" style={linkToContactStyle} rel="noreferrer">
                  O comunícate con nosotros si crees que es un error.
                </Link>
              </Grid>}

            </Grid>

            {/* <Grid container justifyContent="center">

              <Grid item xs={12} sx={{ marginTop: "3em", textAlign: 'center' }}>
                <b style={planesTitleStyle}>Planes</b>
              </Grid>

              <Grid container padding={2}>
                {[0, 1, 2, 3].map(index =>
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <PlanCard cardTitle={planesLaFlota[index].name} cardText={`Con este plan tenes acceso a ${planesLaFlota[index].maxArtists} artista.`}
                      userData={userData} planImgSrc={planesLaFlota[index].imgSource} />
                  </Grid>
                )}
              </Grid>

            </Grid> */}

          </CardBody>

          <CardFooter>
            <Grid container item xs={12} justifyContent="center" spacing={2}>

            </Grid>
          </CardFooter>

        </Card>
      </Grid>

    </Grid >
  );
}

export default Subscription;

const cardDSPNameStyles = { color: "rgba(0,0,0,0.9)", margin: "0", fontWeight: 500, fontSize: "30px", marginBottom: "0" };
const cardCategoryWhiteStyles = { color: "rgba(255,255,255,.62)", margin: "0", fontSize: "14px", marginTop: "0", marginBottom: "0" };
const inactiveSubscriptionWarningStyle = { color: "red", fontSize: "14px", margin: 0 };
const linkToContactStyle = { fontSize: "14px", textDecorationLine: 'underline' };
const planesTitleStyle = { fontSize: '50px', }
const cardTitleWhiteStyles = {
  color: "rgba(255,255,255,255)",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300px",
  fontSize: "40px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}
