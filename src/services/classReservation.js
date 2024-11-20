import { backApi } from "./utils";

const createClassReservations = async (data) => {
    console.log(data)
  try {
    const response = await backApi.post('/api/classreservation', data);
    console.log('Se creo la reserva? ' + JSON.stringify(response))
    return response.data;
  } catch (error) {
    console.error("Error creating class reservation:", error);
    throw error;
  }
};

const readAllClassReservations = async () => {
  try {
    const response = await backApi.get('/api/classreservation');
    return response.data;
  } catch (error) {
    console.error("Error reading class reservations:", error);
    throw error;
  }
};

const getClassReservationById = async (id) => {
  try {
    const response = await backApi.get(`/api/classreservation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting class with id ${id}:`, error);
    throw error;
  }
};
const getClassReservationCurrentById = async (id) => {
  try {
    const response = await backApi.get(`/api/classreservation/currentreservation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting class with id ${id}:`, error);
    throw error;
  }
};



const updateClassReservation = async (id, updatedData) => {
  try {
    const response = await backApi.put(`/api/classreservation/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating class with id ${id}:`, error);
    throw error;
  }
};

const deleteClassReservationById = async (id) => {
  try {
    const response = await backApi.delete(`/api/classreservation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting class with id ${id}:`, error);
    throw error;
  }
};

export {
  createClassReservations,
  readAllClassReservations,
  getClassReservationById,
  updateClassReservation,
  deleteClassReservationById,
  getClassReservationCurrentById
};


