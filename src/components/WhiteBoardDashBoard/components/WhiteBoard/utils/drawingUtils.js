// ./components/Pizarra/drawingUtils.js

export const handleMouseDown = (e, setIsDrawing, setCurrentLine) => {
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    setCurrentLine([pos.x, pos.y]);
  };
  
  export const handleMouseUp = (isDrawing, drawingMode, currentLine, lines, setLines, setCurrentLine, setIsDrawing, currentColor ) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawingMode === 'draw') {
      if (drawingMode === 'draw') {
        // Almacenar tanto los puntos como el color de la línea
        setLines([...lines, { points: currentLine, color: currentColor }]);
      }
    }
    setCurrentLine([]);
  };
  
  export const handleMouseMove = (
    isDrawing, 
    drawingMode, 
    currentLine, 
    lines, 
    setCurrentLine, 
    setLines, 
    e
  ) => {
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
  
  
  export const toggleDrawingMode = (drawingMode, setDrawingMode) => {
    setDrawingMode(drawingMode === 'draw' ? 'erase' : 'draw');
  };
  