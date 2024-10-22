import { backApi } from "./utils";

const createTeacher = async (data) => {
  try {
    const response = await backApi.post('/api/teachers/', data);
    console.log('Se creo un teacher? ' + JSON.stringify(response))
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

const readAllTeachers = async () => {
  try {
    const response = await backApi.get('/api/teachers');
    return response.data;
  } catch (error) {
    console.error("Error reading teachers:", error);
    throw error;
  }
};

const getTeacherById = async (id) => {
  try {
    const response = await backApi.get(`/api/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting teacher with id ${id}:`, error);
    throw error;
  }
};

const updateTeacher = async (id, updatedData) => {
  try {
    const response = await backApi.put(`/api/teachers/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher with id ${id}:`, error);
    throw error;
  }
};

const deleteTeacherById = async (id) => {
  try {
    const response = await backApi.delete(`/api/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting teacher with id ${id}:`, error);
    throw error;
  }
};

export {
  createTeacher,
  readAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacherById
};


