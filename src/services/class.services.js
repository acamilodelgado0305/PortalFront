import { backApi } from "./utils";

const createClass = async (data) =>{
    try {
        const response = await backApi.post('/api/clases/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating teacher:", error);
        throw error;
      }
}
const readAllClasses= async () => {
    try {
      const response = await backApi.get('/api/clases');
      return response.data;
    } catch (error) {
      console.error("Error reading classes:", error);
      throw error;
    }
  };

  const getClassById = async (id) => {
    try {
      const response = await backApi.get(`/api/clases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting class with id ${id}:`, error);
      throw error;
    }
  };

const getClassesByTeacherId = async(teacherId) =>{
    try {
        const response = await backApi.get(`/api/clases/teacherId/${teacherId}`);
        return response.data;
      } catch (error) {
        console.error(`Error getting classes with teacherId : ${teacherId}:`, error);
        throw error;
      }
}

const getClassesByStudentId = async(studentId) =>{
    try {
        const response = await backApi.get(`/api/clases/studentId/${studentId}`);
        return response.data;
      } catch (error) {
        console.error(`Error getting classes with studentId : ${studentId}:`, error);
        throw error;
      }
}


  const updateClassById = async (id, updatedData) => {
    try {
      const response = await backApi.put(`/api/clases/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating class with id ${id}:`, error);
      throw error;
    }
  };
  
  const deleteClassById = async (id) => {
    try {
      const response = await backApi.delete(`/api/clases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting class with id ${id}:`, error);
      throw error;
    }
  };
  
  
export {
    createClass,
    readAllClasses,
    getClassById,
    updateClassById,
    deleteClassById,
    getClassesByTeacherId,
    getClassesByStudentId
};
