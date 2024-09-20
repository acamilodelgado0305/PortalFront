import axios from "axios";

const BACK_URL = import.meta.env.VITE_API_BACKEND;

// Instancia de axios personalizada
const backApi = axios.create({
  baseURL: BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las solicitudes
backApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio de autenticación
export const login = async (email, password) => {
  try {
    const response = await backApi.post("/auth/login", { email, password });
    return response.data; // Devuelve los datos de la respuesta, como el token o el mensaje de éxito
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

//--------------------------------STUDENTS-----------------------------------------------
export const getStudents = async () => {
  try {
    const response = await backApi.get("api/students");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las cuentas:", error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await backApi.post("/api/students", studentData);
    return response.data; // Devuelve los datos de la respuesta, como el ID del estudiante o un mensaje de éxito
  } catch (error) {
    console.error("Error al agregar el estudiante:", error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await backApi.get(`/api/students/${id}`);
    return response.data; // Devuelve los datos del estudiante
  } catch (error) {
    console.error("Error al obtener el estudiante por ID:", error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await backApi.delete(`/api/students/${studentId}`);
    return response.data; // Devuelve los datos de la respuesta, como un mensaje de éxito
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error);
    throw error;
  }
};

//-------------------------------INVOICES-------------------------------

export const getInvoicebyStudent = async (id) => {
  try {
    const response = await backApi.get(`/api/invoices/student/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las facturas por estudiante:", error);
    throw error;
  }
};


export const getTotalPaymentInvoicebyStudent = async (id) => {
  try {
    const response = await backApi.get(`/api/invoices/total-pagado/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el total de facturas pagas por estudiante:", error);
    throw error;
  }
};

export const payInvoice = async (facturaId) => {
  try {
    const response = await backApi.put(`/api/invoices/status/${facturaId}`, {
      estado: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    throw error;
  }
};

//----------------------------------------PROGRAMAS--------------------------------------

export const getPrograms = async () => {
  try {
    const response = await backApi.get("/api/programs");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los programas:", error);
    throw error;
  }
};

export const addProgram = async (programData) => {
  try {
    const response = await backApi.post("/api/programs", programData);

    // Comprueba si la respuesta es exitosa
    if (response.status >= 200 && response.status < 300) {
      return { ok: true, data: response.data }; // Retorna un objeto con 'ok' y 'data' para mantener la coherencia
    } else {
      return { ok: false, error: response.statusText || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error al agregar el programa:", error);

    // Puedes incluir detalles más específicos sobre el error aquí
    return {
      ok: false,
      error: error.message || "Error al realizar la solicitud",
    };
  }
};

export const deleteProgram = async (programId) => {
  try {
    const response = await backApi.delete(`/api/programs/${programId}`);

    if (response.status >= 200 && response.status < 300) {
      return { ok: true, data: response.data };
    } else {
      return { ok: false, error: response.statusText || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error al eliminar el programa:", error);
    return {
      ok: false,
      error: error.message || "Error al realizar la solicitud",
    };
  }
};
