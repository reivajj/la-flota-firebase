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

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.onUploadGenerateThumbnail = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  log("El objeto que recibo", object);

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return logError('This is not an image.');
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (object.size < 100000) {
    return console.log('Already a Thumbnail.');
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
  if (errorDownloadingImage) throw new Error('Error al descargar archivo al tmpFilePath: ', errorDownloadingImage);

  // Generate a thumbnail using ImageMagick.
  [errorGeneratingThumbnail] = await to(spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]));
  if (errorGeneratingThumbnail) throw new Error('Error al generar el thumbnail: ', errorGeneratingThumbnail);

  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFileName = fileName;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  [errorDeletingOriginal] = await to(bucket.file(filePath).delete());
  if (errorDeletingOriginal) throw new Error('Error al eliminar el archivo original: ', errorDeletingOriginal);

  // Uploading the thumbnail.
  [errorUploadingThumbnail] = await to(bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  }));
  if (errorUploadingThumbnail) throw new Error("Error al cargar el thumbnail al Bucket: ", errorUploadingThumbnail);

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  return fs.unlinkSync(tempFilePath);
  // [END thumbnailGeneration]
});
// [END generateThumbnail]