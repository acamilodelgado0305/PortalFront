import React, { createContext, useState } from 'react';

// Crear el contexto
 export const WhiteBoardContext = createContext();

  const WhiteBoardProvider = ({ children }) => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState('draw');
  const [currentColor, setCurrentColor] = useState('red');

  const changeColor = (newColor) => {
    setCurrentColor(newColor);
  };

   const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    setCurrentLine([pos.x, pos.y]);
  };
  
   const handleMouseUp = ( ) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawingMode === 'draw') {
      if (drawingMode === 'draw') {
        setLines([...lines, { points: currentLine, color: currentColor }]);
      }
    }
    setCurrentLine([]);
  };


  
   const handleMouseMove = (e) => {
    if (!isDrawing) return;
  
    const pos = e.target.getStage().getPointerPosition();
  
    if (drawingMode === 'draw') {
      setCurrentLine([...currentLine, pos.x, pos.y]);
  
    } else if (drawingMode === 'erase') {
      const newLines = lines.filter(line => {
        const { points } = line; 
        const lineLength = points.length;
  
        for (let i = 0; i < lineLength; i += 2) {
          const x = points[i];
          const y = points[i + 1];
  
          if (Math.abs(x - pos.x) < 10 && Math.abs(y - pos.y) < 10) {
            return false; 
          }
        }
        return true;
      });
  
      setLines(newLines); 
    }
  };

    // 
  
   const toggleDrawingMode = () => {
    setDrawingMode(drawingMode === 'draw' ? 'erase' : 'draw');
  };
  


  return (
    <WhiteBoardContext.Provider
      value={{
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