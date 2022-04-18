import firebaseApp from "firebaseConfig/firebase.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { to } from 'utils';
import { writeCloudLog } from './LoggingService';

const storage = getStorage(firebaseApp);
const functions = getFunctions();

export const manageAddImageToStorage = async (file, imageUuid, storageBucketName, maxSize, setMessage, setProgress, ownerEmail) => {
  return new Promise((resolve, reject) => {
    if (file["size"] > maxSize) {
      setMessage(`El archivo debe ser menor que ${maxSize / (1024 * 1024)} MB`);
    } else {
      const storageRef = ref(storage, `${storageBucketName}/${imageUuid}`);
      const uploadFileTask = uploadBytesResumable(storageRef, file);

      uploadFileTask.on("state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          setMessage("Error al subir la imagen, intente nuevamente.");
          writeCloudLog(`Error uploading image to FB STORAGE: ${ownerEmail}`, { size: file.size }, error, "error");
          console.log(error);
          return;
        },
        async () => {
          let url = await getDownloadURL(uploadFileTask.snapshot.ref);

          const onCallGenerateThumbnail = httpsCallable(functions, 'storage-onCallGenerateThumbnail');
          const fileBucket = storageRef._location.bucket;
          const filePath = storageRef._location.path_;
          const contentType = file.type;
          const fileSize = file.size;
          const [errorGeneratingThumb] = await to(onCallGenerateThumbnail({ fileBucket, filePath, contentType, fileSize }));

          if (errorGeneratingThumb) {
            writeCloudLog(`Error transforming to thumb image to FB STORAGE: ${ownerEmail}`, { size: file.size }, errorGeneratingThumb, "error");
            setMessage("Error al subir la imagen, intente nuevamente.");
            console.log("Error al subir la imagen, intente nuevamente.", errorGeneratingThumb);
            return;
          }

          resolve({ url, file, storageRef, imageUuid });
        }
      );
    }
  })
};

export const deleteFile = async fileRef => {
  console.log("FILE REF: ", fileRef);
  deleteObject(fileRef).then(result => console.log(result)).catch(error => console.log(error));
}