const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const log = functions.logger.log;
const logError = functions.logger.error;

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

let functionsWithMemory = functions.runWith({ timeoutSeconds: 300, memory: "1GB" });

exports.onCallGenerateThumbnail = functionsWithMemory.https.onCall(async (data) => {
  const { fileBucket, filePath, contentType, fileSize } = data;

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return logError('This is not an image.');
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileSize < 100000) {
    return log('Already a Thumbnail.');
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
    thumb: true
  };

  let [errorDownloadingImage] = await to(bucket.file(filePath).download({ destination: tempFilePath }));
  if (errorDownloadingImage) logError('Error al descargar archivo al tmpFilePath: ', errorDownloadingImage);

  // Generate a thumbnail using ImageMagick.
  [errorGeneratingThumbnail] = await to(spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]));
  if (errorGeneratingThumbnail) logError('Error al generar el thumbnail: ', errorGeneratingThumbnail);

  // Mantengo en pathName del thumbnail con el mismo nombre. 
  const thumbFileName = fileName;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  [errorDeletingOriginal] = await to(bucket.file(filePath).delete());
  if (errorDeletingOriginal) logError('Error al eliminar el archivo original: ', errorDeletingOriginal);

  // Uploading the thumbnail.
  [errorUploadingThumbnail] = await to(bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  }));
  if (errorUploadingThumbnail) logError("Error al cargar el thumbnail al Bucket: ", errorUploadingThumbnail);

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  return fs.unlinkSync(tempFilePath);
});

