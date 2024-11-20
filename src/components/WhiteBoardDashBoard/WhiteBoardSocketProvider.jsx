import  { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WhiteBoardSocketContext = createContext();

// Hook personalizado para usar el contexto de la pizarra
export const useWhiteBoardSocket = () => {
  return useContext(WhiteBoardSocketContext);
};

export const WhiteBoardSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://back-prueba.app.esturio.com/whiteboard'); 
    setSocket(newSocket);
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
