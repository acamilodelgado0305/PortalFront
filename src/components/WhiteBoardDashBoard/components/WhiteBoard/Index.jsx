import { useState, useContext } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor } from './utils/cursorIcons.js';
import { WhiteBoardContext } from './WhiteBoardContext.jsx';

function WhiteBoard() {
  const {      
      lines,
    setLines,
    isDrawing,
    setIsDrawing,
    currentLine,
    setCurrentLine,
    drawingMode,
    currentColor,
    changeColor,
    handleMouseDown,
    handleMouseUp, 
    handleMouseMove,
    toggleDrawingMode } = useContext(WhiteBoardContext); 


  return (
    <div
      style={{
        cursor: drawingMode === 'draw' ? pencilCursor : eraserCursor,
      }}
    >
      <DrawingControls
        drawingMode={drawingMode}
        toggleDrawingMode={() => toggleDrawingMode()}
        changeColor={changeColor}
        currentColor={currentColor}
      />
      <DrawingCanvas
        lines={lines}
        isDrawing={isDrawing}
        handleMouseDown={(e) => handleMouseDown(e)}
        handleMouseUp={() =>
          handleMouseUp(
            isDrawing,
            drawingMode,
            currentLine,
            lines,
            setLines,
            setCurrentLine,
            setIsDrawing,
            currentColor
          )
        }
        handleMouseMove={(e) =>
          handleMouseMove(e)
        }
        currentLine={currentLine}
        currentColor={currentColor}
      />
    </div>
  );
}

export default WhiteBoard;
