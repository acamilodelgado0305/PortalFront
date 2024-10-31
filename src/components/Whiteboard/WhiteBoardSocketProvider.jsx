// WhiteBoardSocketProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Crea el contexto para el socket
const WhiteBoardSocketContext = createContext();

// Hook personalizado para usar el contexto de la pizarra
export const useWhiteBoardSocket = () => {
  return useContext(WhiteBoardSocketContext);
};

// SocketProvider para la pizarra
export const WhiteBoardSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al servidor de Socket.IO, asegúrate de que la URL esté bien configurada
    const newSocket = io('http://localhost:3000/whiteboard'); // Cambia la URL si es necesario
    setSocket(newSocket);

    // Limpiar la conexión cuando el componente se desmonta
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WhiteBoardSocketContext.Provider value={socket}>
      {children}
    </WhiteBoardSocketContext.Provider>
  );
};
