import { useState } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { handleMouseDown, handleMouseUp, handleMouseMove, toggleDrawingMode } from './utils/drawingUtils.js';
import { pencilCursor, eraserCursor } from './utils/cursorIcons.js';

function WhiteBoard() {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState('draw');
  const [currentColor, setcurrentColor] = useState('red');

  const changeColor = (newColor) => {
    setcurrentColor(newColor); 
  }

  return (
    <div
      style={{
        cursor: drawingMode === 'draw' ? pencilCursor : eraserCursor,
      }}
    >
      <DrawingControls
        drawingMode={drawingMode}
        toggleDrawingMode={() => toggleDrawingMode(drawingMode, setDrawingMode)}
        changeColor={changeColor}
      />
      <DrawingCanvas
        lines={lines}
        isDrawing={isDrawing}
        handleMouseDown={(e) => handleMouseDown(e, setIsDrawing, setCurrentLine)}
        handleMouseUp={() =>
          handleMouseUp(
            isDrawing,
            drawingMode,
            currentLine,
            lines,
            setLines,
            setCurrentLine,
            setIsDrawing
          )
        }
        handleMouseMove={(e) =>
          handleMouseMove(isDrawing, drawingMode, currentLine, lines, setCurrentLine, setLines, e)
        }
        currentLine={currentLine}
        currentColor={currentColor}
      />
    </div>
  );
}

export default WhiteBoard;
