const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const uuid = uuidv4();
const storage = new Storage({
  projectId: "back-amaneciendo",
  keyFilename: './serviceAccountKey.json'
});
const bucket = storage.bucket("gs://back-amaneciendo.appspot.com");

module.exports = (file, pathImage, deletePathImage) => {
  return new Promise((resolve, reject) => {
    console.log('delete path', deletePathImage);
    console.log("este es la imagen path: " + pathImage);
    console.log("este es el archivo: " + file.path);

    if (deletePathImage) {
      if (deletePathImage != null || deletePathImage != undefined) {
        const parseDeletePathImage = url.parse(deletePathImage);
        var ulrDelete = parseDeletePathImage.pathname.slice(23);
        const fileDelete = bucket.file(`${ulrDelete}`);
        
        fileDelete.delete().then((imageDelete) => {
          console.log('se borro la imagen con exito');
        }).catch(err => {
          console.log('Failed to remove photo, error:', err);
        });
      }
    }

    if (pathImage) {
      if (pathImage != null || pathImage != undefined) {
        let fileUpload = bucket.file(`${pathImage}`);
        
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
          resumable: false,
        });

        blobStream.on('error', (error) => {
          console.log('Error al subir archivo a firebase', error);
          reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
          const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
          console.log('URL DE CLOUD STORAGE ', url);

          // Eliminar el archivo de la carpeta "uploads"
          fs.unlinkSync(file.path);

          resolve(url);
        });

        // Leer el archivo desde la ruta completa y pasarlo al blobStream
        fs.createReadStream(file.path).pipe(blobStream);
      }
    }
  });
};