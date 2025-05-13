import axios from 'axios';
import FormData from 'form-data';

export const uploadToImageKit = async (fileBuffer, fileName, mimeType, folderPath = 'logos') => {
  const form = new FormData();

  // Aseguramos que el archivo esté bien formateado
  form.append('file', fileBuffer, {
    filename: fileName, // Nombre del archivo
    contentType: mimeType, // Tipo de archivo (image/png, image/jpg, etc.)
  });
  form.append('fileName', fileName);
  form.append('useUniqueFileName', 'true'); // Si deseas que ImageKit cree un nombre único para el archivo

  // Aseguramos que la imagen se suba a la carpeta 'logos'
  form.append('folder', folderPath); // Aquí añadimos el parámetro `folder` para especificar la carpeta

  const privateApiKey = process.env.IMAGEKIT_PRIVATE_API_KEY; // Asegúrate de tener la clave privada correctamente configurada

  try {
    // Hacemos la solicitud POST a ImageKit
    const response = await axios.post(
      'https://upload.imagekit.io/api/v1/files/upload',
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        auth: {
          username: privateApiKey,
          password: '',
        },
      }
    );

    return response.data.url; // Devuelve la URL pública de la imagen
  } catch (error) {
    console.error('Error al subir la imagen a ImageKit:', error.response ? error.response.data : error.message);
    throw new Error('Error al subir la imagen a ImageKit');
  }
};


