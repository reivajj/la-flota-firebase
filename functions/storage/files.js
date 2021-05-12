const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const concat = require("concat-stream")

const log = functions.logger.log;

// Modulo para manejar el await/async y poder capturar los errores y no tener que usar CATCH TRY
// Mas info en: https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
// const to = require('await-to-js').default;
function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}


/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.onUploadFileDetectAndCreateCorrectAction = functions.storage.object().onFinalize(async (object) => {
  // [START eventAttributes]
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/') && !contentType.startsWith('audio/')) {
    return console.log('This is not an accepted file.');
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    return console.log('Already a Thumbnail.');
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
  };

  let targetFile = bucket.file(filePath);
  let readStreamTargetFile = targetFile.createReadStream();
  log("ReadStreaTargetFie: ", readStreamTargetFile);
  // readStreamTargetFile.on('error', err => log("error al hacer readStreamTargetFile: ", err))
  //   .on('response', response => log("Leyendo on response: ", response))
  //   .on('end', async () => {
  //     // The file is fully downloaded.
  //     log("el readStreamTargetFile onFinish: ", readStreamTargetFile, "/ and Filename: ", fileName);
  //     const formData = new FormData();
  //     formData.append("artist_id", "98959");
  //     formData.append("c_line", "2020 Tests");
  //     formData.append("label_id", "18147");
  //     formData.append("p_line", "2020 Tests");
  //     formData.append("release_date", "2020-12-21");
  //     formData.append("sale_start_date", "2021-12-10");
  //     formData.append("title", "0.NewFirebaseAlbum");
  //     formData.append("cover", readStreamTargetFile, fileName);

  //     log("El formData: ", formData);

  //     const response = await axios.post('https://api.dashgo.com/api/v1/albums/', formData, {
  //       // You need to use `getHeaders()` in Node.js because Axios doesn't
  //       // automatically set the multipart form boundary in Node.
  //       headers: {
  //         ...formData.getHeaders(),
  //         "Content-Type": "multipart/form-data",
  //         "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
  //       }
  //     });
  //   })

  let [error, dataDown] = await to(bucket.file(filePath).download({ destination: tempFilePath }));
  if (error) throw new Error('Error al descargar archivo al tmpFilePath: ', error);

  fs.readFile(tempFilePath, async (error, dataBuffer) => {
    if (error) console.log("Error al pedir e lbuffer:", dataBuffer);
    log("Data Buffer: ", dataBuffer);
    const formData = new FormData();
    log("El formData0: ", formData);
    formData.append("artist_id", "98959");
    formData.append("c_line", "2020 Tests");
    formData.append("label_id", "18147");
    formData.append("p_line", "2020 Tests");
    formData.append("release_date", "2020-12-21");
    formData.append("sale_start_date", "2021-12-10");
    formData.append("title", "2");
    formData.append("cover", dataBuffer, 'primerImagen.jpg');

    const response = await axios.post('https://api.dashgo.com/api/v1/albums/', formData, {
      headers: {
        ...formData.getHeaders(),
        "Content-Type": "multipart/form-data",
        "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
      }
    });
    log("The response from axios: ", response);
  })

  // if (contentType.startsWith('image/')) {
  //   log('Image downloaded locally to', tempFilePath);
  //   // Generate a thumbnail using ImageMagick.
  //   [error, data] = await to(spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]));
  //   if (error) throw new Error('Error al generar el thumbnail: ', error);

  //   log('Thumbnail created at', tempFilePath);
  //   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  //   const thumbFileName = `thumb_${fileName}`;
  //   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  //   // Uploading the thumbnail.
  //   [error, data] = await to(bucket.upload(tempFilePath, {
  //     destination: thumbFilePath,
  //     metadata: metadata,
  //   }));
  //   if (error) throw new Error("Error al cargar el thumbnail al Bucket: ", error);

  //   [error, data] = await to(bucket.file(filePath).delete());
  //   if (error) throw new Error('Error al eliminar el archivo original: ', error);
  //   // Once the thumbnail has been uploaded delete the local file to free up disk space.
  // }
  // else {
  //   log("El acrchivo es un AUDIO", dataFile);
  // }

  // return fs.unlinkSync(tempFilePath);
  // [END thumbnailGeneration]
});
// [END generateThumbnail]

const createAlbumFormData = coverFile => {

  log("El albumCover: ", coverFile);

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
}