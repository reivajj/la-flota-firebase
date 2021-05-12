const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const axios = require("axios");
// const path = require("path");
const express = require("express");
const FormData = require("form-data");
// const fs = require("fs");
// var multer = require("multer");
// var upload = multer();

const log = functions.logger.log;

// const to = (promise) => {
//   return promise.then((data) => {
//     return [null, data];
//   })
//     .catch((err) => [err]);
// };

const formData = new FormData();

exports.getAlbums = functions.https.onCall(async (data, context) => {
  let { msg } = data;

  return axios.get("https://api.dashgo.com/api/v1/albums/", {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Access-Key": "laflota-kladsjf-2229-5582-5222-fkgnnEAD",
      "Host": "api.dashgo.com",
    },
  })
    .then((response) => {
      log(response.data);
      return {
        message: response.data,
      };
    })
    .catch((error) => {
      throw new functions.https.HttpsError("No se pudo obtener los Albums! ", error.message, error);
    });
});

exports.uploadAlbum = functions.https.onCall(async (data, context) => {
  
  let { album, msg } = data;
  log("El msg: ", msg);
  log("El artist_id del album: ", album.artist_id)
  log("El album: ", album)

  formData.append("artist_id", "98959");
  formData.append("c_line", "2020 Tests");
  formData.append("label_id", "18147");
  formData.append("p_line", "2020 Tests");
  formData.append("release_date", "2020-12-21");
  formData.append("sale_start_date", "2021-12-10");
  formData.append("title", "0.NewFirebaseAlbum");
  // formData.append("cover", album.cover.buffer, data.cover.originalname);

  log("FormData: ", formData);

  // try {
  //   const response = await axios.post('https://api.dashgo.com/api/v1/albums/', formData, {
  //     // You need to use `getHeaders()` in Node.js because Axios doesn't
  //     // automatically set the multipart form boundary in Node.
  //     headers: {
  //       ...formData.getHeaders(),
  //       "Content-Type": "multipart/form-data",
  //       "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
  //     }
  //   });
  //   console.log("El FormData: ", formData);
  //   console.log("El REQ: ", req.body);
  //   console.log("EL FILE: ", req.file);
  //   return res.status(200).send({ response: response.data, formDataSend: formData });
  // } catch (error) {
  //   console.log("El FormData: ", formData);
  //   console.log("El REQ: ", req.body);
  //   console.log("EL FILE: ", req.file);
  //   return res.status(400).send({ dataResponse: error });
  // }
  return {
    formData: formData,
  };
});

// app.post('/api/uploadTrack', upload.single('track'), async (req, res, next) => {
//   formData.append("album_id", "175752");
//   formData.append("disc_number", "4");
//   formData.append("explicit", "0");
//   formData.append("position", "2");
//   formData.append("title", "1.OtherTrackTest1");
//   formData.append("sale_start_date", "2021-12-10");
//   formData.append("artist_id", "98959");
//   formData.append("price", "0.99");
//   formData.append("track", req.file.buffer, req.file.originalname);

//   try {
//     const response = await axios.post('https://api.dashgo.com/api/v1/tracks/', formData, {
//       // You need to use `getHeaders()` in Node.js because Axios doesn't
//       // automatically set the multipart form boundary in Node.
//       headers: {
//         ...formData.getHeaders(),
//         "Content-Type": "multipart/form-data",
//         "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
//       }
//     });
//     console.log("El FormData: ", formData);
//     console.log("El REQ: ", req.body);
//     console.log("EL FILE: ", req.file);
//     return res.status(200).send({ response: response.data, formDataSend: formData });
//   } catch (error) {
//     console.log("El FormData: ", formData);
//     console.log("El REQ: ", req.body);
//     console.log("EL FILE: ", req.file);
//     return res.status(400).send({ dataResponse: error });
//   }

// });
