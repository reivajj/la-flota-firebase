import React, { useState, useEffect } from "react";
import firebase from "firebaseConfig/firebase.js";
import Button from "components/CustomButtons/Button.js";
import { Grid } from '@material-ui/core';
import Skeleton from "react-loading-skeleton";
import axios from "axios";

firebase.functions().useEmulator("localhost", 5001);

export default function FileUpload() {
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
    // let fileType = file.type === "image/jpeg" ? "covers" : "tracks";
    // let nameFileInStorage = fileType === "covers" ? "primerImagen" : "primerTrack";
    // //console.log(file['name']);
    // // if (file["size"] > 524288) {
    // // _simpleAlertHandler("El archivo debe ser menor que 500 Kb");
    // // } else {
    // const storageRef = firebase
    //   .storage()
    //   .ref(`${fileType}/${file.name}`)
    //   .put(file);
    // storageRef.on(
    //   "state_changed",
    //   (snapshot) => {
    //     //progress function
    //     console.log("Snapshot file: ", snapshot);
    //   },
    //   (error) => {
    //     //error function
    //     console.log(error);
    //   },
    //   () => {
    //     firebase
    //       .storage()
    //       .ref(`${fileType}`)
    //       .child(`${file.name}`)
    //       .getDownloadURL()
    //       .then((url) => {
    //         fileType === "covers" && guardarUrlImagen(url);
    //         console.log("La url del File: ", url);
    //         // // setImageLoaded(true);
    //         const imageRef = firebase.storage().ref().child(`${fileType}/${file.name}`);
    //         console.log("File REF: ", imageRef);
    //         return "ok";
    //         // setImageReference(imageRef);
    //       })
    //       .catch(error => console.log("Error!", error));
    //   }
    // );
  }

  // const createAlbumToUpload = file => {
  //   let formData = new FormData();

  //   formData.append("artist_id", "98959");
  //   formData.append("c_line", "2020 Tests");
  //   formData.append("label_id", "18147");
  //   formData.append("p_line", "2020 Tests");
  //   formData.append("release_date", "2020-12-21");
  //   formData.append("sale_start_date", "2021-12-10");
  //   formData.append("title", "1.NewTestAlbum");
  //   formData.append("cover", file);

  //   console.log("Data album: ", formData);
  //   console.log("File: ", file);

  //   return formData;
  // };

  const uploadAlbumFromServer = async () => {
    let formData = new FormData();

    let file = selectedFiles[0];

    formData.append("artist_id", "126185");
    formData.append("c_line", "2020 Tests");
    formData.append("label_id", "29304");
    formData.append("p_line", "2020 Tests");
    formData.append("release_date", "2020-12-21");
    formData.append("sale_start_date", "2021-12-10");
    formData.append("title", "2Firebase");
    formData.append("cover", file);

    console.log("FormData: ", formData);
    console.log("File: ", file);

    try {
      const res = await axios.post("https://dashboard2.laflota.com.ar/filemanagerapp/api/uploadAlbum", formData, {
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



  // const getAlbumsFromDashGo = () => {
  //   let dashGoGetAlbums = firebase.functions().httpsCallable('dashGo-getAlbums');

  //   dashGoGetAlbums({ msg: "Estoy pidiendo los albums" })
  //     .then(result => {
  //       console.log("Lo que devuelve la function getAlbums con result: ", result);
  //       console.log("Lo que devuelve la function getAlbums con result.data: ", result.data);
  //       return "OK";
  //     })
  //     .catch(error => console.log("Error al buscar los albumes desde DashGo: ", error));
  // }

  const getApiResponseFromServer = async () => {
    try {
      const res = await axios.get("https://dashboard2.laflota.com.ar/filemanagerapp/api");
      return console.log("La respuesta: ", res);
    } catch (error) {
      return console.log("el error: ", error);
    }
  };

  const getAllAlbumsFromServer = async () => {
    try {
      const res = await axios.get("https://dashboard2.laflota.com.ar/filemanagerapp/api/getAllAlbums");
      return console.log("La respuesta: ", res);
    } catch (error) {
      return console.log("el error: ", error);
    }
  };

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
    console.log("selected files: ", event.target.files[0]);
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

      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>

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

      <Button
        color="primary"
        onClick={getApiResponseFromServer}
      >
        Get Response
      </Button>

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