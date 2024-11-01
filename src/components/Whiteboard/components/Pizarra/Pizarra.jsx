import { useState } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { handleMouseDown, handleMouseUp, handleMouseMove, toggleDrawingMode } from './utils/drawingUtils.js';

function Pizarra() {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState('draw');

  return (
    <div>
      <DrawingControls drawingMode={drawingMode} toggleDrawingMode={() => toggleDrawingMode(drawingMode, setDrawingMode)} />
      <DrawingCanvas 
        lines={lines} 
        isDrawing={isDrawing} 
        handleMouseDown={(e) => handleMouseDown(e, setIsDrawing, setCurrentLine)} 
        handleMouseUp={() => handleMouseUp(isDrawing, drawingMode, currentLine, lines, setLines, setCurrentLine, setIsDrawing)} 
        handleMouseMove={(e) => handleMouseMove(isDrawing, drawingMode, currentLine, lines, setCurrentLine, setLines, e)} 
        currentLine={currentLine} 
      />
    </div>
  );
}

export default Pizarra;
