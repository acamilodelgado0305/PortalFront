import { backApi } from "./utils";

const createStudent = async (data) => {
  try {
    const response = await backApi.post('/api/students/', data);
    console.log('Se creo un Student? ' + JSON.stringify(response))
    return response.data;
  } catch (error) {
    console.error("Error creating Student:", error);
    throw error;
  }
};

const readAllStudents = async () => {
  try {
    const response = await backApi.get('/api/students');
    return response.data;
  } catch (error) {
    console.error("Error reading Students:", error);
    throw error;
  }
};

const getStudentById = async (id) => {
  try {
    const response = await backApi.get(`/api/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting Student with id ${id}:`, error);
    throw error;
  }
};

const updateStudent = async (id, updatedData) => {
  try {
    const response = await backApi.put(`/api/students/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating Student with id ${id}:`, error);
    throw error;
  }
};

const deleteStudentById = async (id) => {
  try {
    const response = await backApi.delete(`/api/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Student with id ${id}:`, error);
    throw error;
  }
};

const createStudentCognito = async (data) => {
  try {
    const response = await backApi.post('/api/users/', data);
    console.log('create Student cognito? ' + JSON.stringify(response))
    return response.data;
  } catch (error) {
    console.error("Error creating Student:", error);
    throw error;
  }
};
const codeStudentCognito = async (data) => {
  try {
    const response = await backApi.post('/api/users/verify-email', data);
    console.log("code send")
    return response.data;
  } catch (error) {
    console.error("err:", error);
    throw error;
  }
};
const resendCodeCognito = async (data) => {
  try {
    const response = await backApi.post('/api/users/resend-verification', data);
    console.log("code send")
    return response.data;
  } catch (error) {
    console.error("err:", error);
    throw error;
  }
};
const loginCognito = async (email, password) => {
  try {
    const response = await backApi.post('/api/users/login', {email, password});
    console.log("user Login")
    return response.data;
  } catch (error) {
    console.error("err:", error);
    throw error;
  }
};

export {
  createStudent,
  readAllStudents,
  getStudentById,
  updateStudent,
  deleteStudentById,
  createStudentCognito,
  codeStudentCognito,
  resendCodeCognito,
  loginCognito
};


