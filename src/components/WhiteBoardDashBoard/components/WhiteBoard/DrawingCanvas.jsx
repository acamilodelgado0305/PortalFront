import { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

function DrawingCanvas({ context }) {
  const containerRef = useRef(null);
  const emitToSocket = true; 


  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage
        width={containerRef.current?.clientWidth || 0}
        height={window.innerHeight}
        onMouseDown={(e) => context.handleMouseDown(e.target.getStage().getPointerPosition(), emitToSocket)}
        onMouseUp={() => context.handleMouseUp(emitToSocket)}
        onMouseMove={(e) => 
          context.drawingMode === 'draw' 
            ? context.handleMouseMoveDraw(e.target.getStage().getPointerPosition(), emitToSocket) 
            : context.handleMouseMoveErase(e.target.getStage().getPointerPosition(), emitToSocket)
        }
      >
        <Layer>
          {context.lines && context.lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width || 2} // Usa el ancho de la línea desde el estado
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {context.isDrawing && (
            <Line
              points={context.currentLine}
              stroke={context.currentColor}
              strokeWidth={context.lineWidth} 
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default DrawingCanvas;
