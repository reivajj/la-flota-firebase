import React from "react";

import { Grid } from '@mui/material';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ProgressButtonWithInputFile from 'components/CustomButtons/ProgressButtonWithInputFile';
import { Image as ReactImage } from 'mui-image';
import Danger from 'components/Typography/Danger.js';

const ImageInput = ({ imagenUrl, onClickAddImage, helperText, textButton, progress, message }) => {

  return (
      <Grid item xs={12}>
        <ProgressButtonWithInputFile
          textButton={(progress === 100 && imagenUrl) ? "Cambiar Imagen" : textButton}
          loading={progress > 0 && !imagenUrl}
          buttonState={progress < 100 ? "none" : "success"}
          onClickHandler={onClickAddImage}
          progress={progress}
          fileType={"image/*"}
          helperText={helperText}
        />

        <Danger color="error" variant="h6">
          {message}
        </Danger>

        {!imagenUrl && (
          <Grid>
            <SkeletonTheme color="antiquewhite" >
              <Skeleton circle width={250} height={250} />
            </SkeletonTheme>
          </Grid>
        )}

        {imagenUrl && (
          <Grid >
            <ReactImage
              style={{ width: 250, height: 220, borderRadius: 40 }}
              alt="album-image"
              duration={30}
              src={imagenUrl}
            />
          </Grid>
        )}
      </Grid>
  )
}

export default ImageInput;