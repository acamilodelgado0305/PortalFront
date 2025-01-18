//import axios from "axios";

import axios from "axios";

const BACK_URL = "https://back.app.esturio.com";



// Instancia de axios personalizada
export const backApi = axios.create({
  baseURL: BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const uploadFile = async (file, contentType) => {
  try {
    const response = await backApi.post('/api/upload', file, {
      headers: { 'Content-Type': contentType },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Progreso de carga: ${percentCompleted}%`);
      }
    });
    console.log('URL ' + JSON.stringify(response.data.url))
    if (response.data && response.data.url) {
      return {
        success: true,
        url: response.data.url
      };
    } else {
      throw new Error('La respuesta del servidor no contiene la URL de la imagen');
    }
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al subir la imagen'
    };
  }
};
