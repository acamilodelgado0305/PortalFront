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


const createTeacher = async (teacherData) => {
  try {
    const response = await backApi.post('/api/teachers', teacherData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Profesor creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el profesor:', error);
    throw error;
  }
};

export default createTeacher;
