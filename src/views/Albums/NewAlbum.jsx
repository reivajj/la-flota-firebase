import React, { useState, useEffect } from "react";
import firebase from "firebaseConfig/firebase.js";
import Button from "components/CustomButtons/Button.js";
import { Grid } from '@material-ui/core';
import Skeleton from "react-loading-skeleton";
import axios from "axios";

firebase.functions().useEmulator("localhost", 5001);

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const NewAlbum = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress] = useState(0);
  const [message] = useState("");

  // const [fileInfos, setFileInfos] = useState([]);

  // const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageReference, setImageReference] = useState('');
  // const [progreso, guardarProgreso] = useState(0);
  const [urlImagen] = useState("");

  const fileChangedHandler = (event) => {
    const file = event.target.files[0];
    console.log("El archivo: ", file);
    setCurrentFile(selectedFiles[0]);
  }

  const createAlbumToUpload = coverFile => {
    let formData = new FormData();

    formData.append("artist_id", "126185");
    formData.append("c_line", "2020 Tests");
    formData.append("label_id", "29304");
    formData.append("p_line", "2020 Tests");
    formData.append("release_date", "2020-12-21");
    formData.append("sale_start_date", "2021-12-10");
    formData.append("title", "2Firebase");
    formData.append("cover", coverFile);

    console.log("Data album: ", formData);
    console.log("File: ", coverFile);

    return formData;
  };

  const uploadAlbumFromServer = async () => {
    let coverFile = selectedFiles[0];
    let formData = createAlbumToUpload(coverFile);

    console.log("FormData: ", formData);
    console.log("File: ", coverFile);

    try {
      const res = await axios.post("https://dashboard2.laflota.com.ar/filemanagerapp/api/albums/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      return console.log("La respuesta: ", res);
    } catch (error) {
      return console.log("el error: ", error);
    }
  };


  // const uploadTrackFromServer = async (file, onUploadProgress) => {
  //   let formData = new FormData();

  //   formData.append("artist_id", "126185");
  //   formData.append("c_line", "2020 Tests");
  //   formData.append("label_id", "29304");
  //   formData.append("p_line", "2020 Tests");
  //   formData.append("release_date", "2020-12-21");
  //   formData.append("sale_start_date", "2021-12-10");
  //   formData.append("title", "1.NewTestAlbum");
  //   formData.append("track", file);

  //   console.log("FormData: ", formData);
  //   console.log("File: ", file);

  //   try {
  //     const res = await axios.post("https://localhost:8000/api/uploadTrack", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       },
  //       onUploadProgress,
  //     });
  //     return console.log("La respuesta: ", res);
  //   } catch (error) {
  //     return console.log("el error: ", error);
  //   }

  // };

  const getAllAlbumsFromServer = async () => {
    const [errorGettingAlbums, albumsData] = await to(axios.get("https://dashboard2.laflota.com.ar/filemanagerapp/api/albums"));
    if (errorGettingAlbums) throw new Error("Error al traer los albums: ", errorGettingAlbums);
    console.log("La respuesta: ", albumsData);
  };

  useEffect(() => {
    console.log("El FormData: ", currentFile);
    // UploadService.getFiles().then((response) => {
    //   setFileInfos(response.data);
    // });
  }, []);

  return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <Button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={uploadAlbumFromServer}
      >
        Upload Album
      </Button>

      <Button
        color="primary"
        onClick={getAllAlbumsFromServer}
      >
        Get Albums
      </Button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      <input
        type="file"
        // accept="image/*"
        // size="1024"
        onChange={fileChangedHandler}
      />
      {!urlImagen && (
        <Grid>
          <Skeleton variant="rect" width={250} height={220} />
        </Grid>
      )}

      {urlImagen && (
        <Grid >
          <img
            style={{ width: 250, height: 220 }}
            alt={""}
            src={urlImagen}
          />
        </Grid>
      )}

      {/* <div className="card">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {fileInfos &&
            fileInfos.map((file, index) => (
              <li className="list-group-item" key={index}>
                <a href={file.url}>{file.name}</a>
              </li>
            ))}
        </ul>
      </div> */}
    </div>
  );
}

export default NewAlbum;