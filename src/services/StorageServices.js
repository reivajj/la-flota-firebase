import firebaseApp from "firebaseConfig/firebase.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { to } from 'utils';

const storage = getStorage(firebaseApp);
const functions = getFunctions();

export const manageAddImageToStorage = async (file, imageUuid, storageBucketName, maxSize, setMessage, setProgress) => {
  return new Promise((resolve, reject) => {
    if (file["size"] > maxSize) {
      setMessage(`El archivo debe ser menor que ${maxSize / (1024 * 1024)} MB`);
    } else {
      const storageRef = ref(storage, `${storageBucketName}/${imageUuid}`)
      const uploadFileTask = uploadBytesResumable(storageRef, file);

      uploadFileTask.on("state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          setMessage("Error al subir la imagen, intente nuevamente.");
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
          const [errorGeneratingThumb, resultThumbGenerate] = await to(onCallGenerateThumbnail({ fileBucket, filePath, contentType, fileSize }));

          if (errorGeneratingThumb) {
            setMessage("Error al subir la imagen, intente nuevamente.");
            console.log("Error al subir la imagen, intente nuevamente.", errorGeneratingThumb);
            return;
          }

          console.log("Result:", resultThumbGenerate);
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