import axios from "axios";

const BACK_URL = import.meta.env.VITE_API_BACKEND || 'http://localhost:8000';

// Instancia de axios personalizada
const backApi = axios.create({
  baseURL: BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const handleUpload = async (file) => {
  // Crear un objeto FormData y añadir el archivo
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await backApi.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Añadir estas opciones para mostrar el progreso de la carga si lo deseas
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Progreso de carga: ${percentCompleted}%`);
      }
    });

    // Verificar si la respuesta contiene los datos esperados
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


