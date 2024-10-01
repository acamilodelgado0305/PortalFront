//import axios from "axios";

import axios from "axios";

const BACK_URL = import.meta.env.VITE_API_BACKEND || "http://localhost:4005";

// Instancia de axios personalizada
const backApi = axios.create({
  baseURL: BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
      const response = await backApi.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('URL de la imagen subida:', response.data.url);
      return response.data.url;
  } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
  }
};