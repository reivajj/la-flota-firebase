import * as React from 'react';
import { mainColor, materialColor } from '../../variables/colors';
import { planesLaFlota } from '../../variables/varias';
import { Grid, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

const PlanCard = ({ cardTitle, cardText, cardBullets, planImgSrc, userData }) => {

  let userActualPlanName = planesLaFlota.find(plan => plan.id === userData.plan)?.name;
  let isCurrentPlan = cardTitle === userActualPlanName;
  let borderHeight = 5;
  const cardStyle = {
    maxWidth: isCurrentPlan ? 345 - borderHeight * 2 : 345, height: isCurrentPlan ? 500 - borderHeight * 2 : 500,
    backgroundColor: materialColor, borderRadius: "4em", marginTop: "7%", width: "95%",
    border: isCurrentPlan ? 5 : 0, borderColor: mainColor,
  };

  return (
    <Card sx={cardStyle} raised={true}>
      <CardMedia
        sx={{ height: "40%" }}
        component="img"
        height="200"
        image={planImgSrc}
        alt="green iguana"
      />
      <CardContent sx={{ height: "45%" }}>
        <Grid item xs={12} sx={{ height: "30%" }}>
          <Typography gutterBottom variant="h5" component="div" color="white">
            {cardTitle}
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ height: "70%" }}>
          <Typography variant="body2" color="white">
            {cardText}
          </Typography>
        </Grid>

      </CardContent>

      <CardActions sx={{ justifyContent: 'center', height: "5%" }}>
        <Button size="small" sx={{ color: "white", fontSize: "1em" }}>{isCurrentPlan ? "Plan actual" : "Contratar"}</Button>
      </CardActions>
    </Card>
  );
}

export default PlanCard;

