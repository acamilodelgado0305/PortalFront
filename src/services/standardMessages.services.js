import { backApi } from "./utils";

const createStandardMessage = async (data) => {
  try {
    const response = await backApi.post(`/api/standardMessages/`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating StandardMessage:", error);
    throw error;
  }
};
const getStandardMessageById = async (id) => {
  try {
    const response = await backApi.get(`/api/standardMessages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting StandardMessage:", error);
    throw error;
  }
};

const getStandarMessagesByChatId = async (chatId) => {
  try {
    const response = await backApi.get(`/api/standardMessages/chatId/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting StandarMessages by chatId :", error);
    throw error;
  }
};

const updateStandardMessage = async (id) => {
  try {
    const response = await backApi.put(`/api/standardMessages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating StandarMessage:", error);
    throw error;
  }
};

const deleteStandardMessageById = async (id) => {
  try {
    const response = await backApi.delete(`/api/standardMessages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting StandarMessage:", error);
    throw error;
  }
};

const deleteStandarMessagesByChatId = async (chatId) => {
  try {
    const response = await backApi.delete(`/api/standardMessages/chatId/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting StandarMessages by chatId :", error);
    throw error;
  }
};

export {
  createStandardMessage,
  getStandardMessageById,
  getStandarMessagesByChatId,
  updateStandardMessage,
  deleteStandardMessageById,
  deleteStandarMessagesByChatId
};
