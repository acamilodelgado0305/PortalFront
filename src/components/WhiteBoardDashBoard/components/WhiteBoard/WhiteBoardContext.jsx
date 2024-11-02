import { createContext, useState, useContext } from 'react';
import { useWhiteBoardSocket } from '../../WhiteBoardSocketProvider.jsx'; 

// Crear el contexto
 export const WhiteBoardContext = createContext();

  const WhiteBoardProvider = ({ children }) => {
  const socket = useWhiteBoardSocket();
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState('draw');
  const [currentColor, setCurrentColor] = useState('red');
  
// Hook personalizado para usar el contexto de la pizarra FALTA IMPLEMENTAR!!
 const useWhiteBoard = () => {
  return useContext(WhiteBoardContext);
};

  const changeColor = (newColor, emitToSocket) => {
    setCurrentColor(newColor);

    if(emitToSocket && socket) {
      socket.emit('changeColor', newColor)
    }

  };

   const handleMouseDown = (position, emitToSocket) => {
    setIsDrawing(true);
    setCurrentLine([position.x, position.y]);

    if(emitToSocket && socket) {
      socket.emit('mouseDown', position)
    }
  };

     const handleMouseMove = (position, emitToSocket) => {
    if (!isDrawing) return;
    if (drawingMode === 'draw') {
      setCurrentLine([...currentLine, position.x, position.y]);
  
    } else if (drawingMode === 'erase') {
      const newLines = lines.filter(line => {
        const { points } = line; 
        const lineLength = points.length;
  
        for (let i = 0; i < lineLength; i += 2) {
          const x = points[i];
          const y = points[i + 1];
  
          if (Math.abs(x - position.x) < 10 && Math.abs(y - position.y) < 10) {
            return false; 
          }
        }
        return true;
      });
  
      setLines(newLines); 
    }
    if(emitToSocket && socket) {
      socket.emit('mouseMove', position)
    }
  }; 
  
  const toggleDrawingMode = (emitToSocket) => {
    setDrawingMode(drawingMode === 'draw' ? 'erase' : 'draw');

    if(emitToSocket && socket) {
      socket.emit('toggleDrawingMode')
    }
  };
   const handleMouseUp = (emitToSocket) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawingMode === 'draw') {
      if (drawingMode === 'draw') {
        setLines([...lines, { points: currentLine, color: currentColor }]);
      }
    }
    setCurrentLine([]);

    if(emitToSocket && socket) {
      socket.emit('mouseUp')
    }
  };


  


 
  

  


  return (
    <WhiteBoardContext.Provider
      value={{
        useWhiteBoard,
        lines,
        setLines,
        isDrawing,
        setIsDrawing,
        currentLine,
        setCurrentLine,
        drawingMode,
        setDrawingMode,
        currentColor,
        changeColor,
        handleMouseDown,
        handleMouseUp, 
        handleMouseMove,
        toggleDrawingMode

      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};
export default WhiteBoardProvider;