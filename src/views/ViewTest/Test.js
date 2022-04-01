import React, { useState, useEffect, useRef } from "react";

import { userIsDev } from "utils/users.utils";
import { Grid } from '@mui/material';

import Uppy from '@uppy/core';
import FileInput from '@uppy/file-input';
import XHRUpload from '@uppy/xhr-upload';
import { DragDrop } from '@uppy/react'

import { localUrl } from '../../services/BackendCommunication';
import ImageInput from '../../components/Input/ImageInput';
import { to } from '../../utils';
import axios from "../../../node_modules/axios/index";

const Test = ({ editing }) => {

  // document.querySelector('.Uppy').innerHTML = ''
  const [urlImage, setUrlImage] = useState("");
  const uppy = new Uppy({ debug: true, autoProceed: true })

  uppy.use(XHRUpload, {
    endpoint: `${localUrl}albums/uploadCover`,
    formData: true,
    fieldName: 'file',
    method: 'post'
  })

  // And display uploaded files
  uppy.on('upload-success', (file, response) => {
    console.log("URL:", { response })
  })

  return userIsDev("admin-dev")
    ? (
      <Grid container textAlign="center">
        <img src={urlImage} alt="Current Avatar" />
        <DragDrop
          uppy={uppy}
          locale={{
            strings: {
              // Text to show on the droppable area.
              // `%{browse}` is replaced with a link that opens the system file selection dialog.
              dropHereOr: 'Drop here or %{browse}',
              // Used as the label for the link that opens the system file selection dialog.
              browse: 'browse',
            },
          }}
        />
      </Grid >
    ) : <p>Este sitio es solo para los desarrolladores</p>;
}

export default Test;
