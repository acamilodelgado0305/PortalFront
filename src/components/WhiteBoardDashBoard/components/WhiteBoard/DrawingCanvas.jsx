import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import DrawingControls from './DrawingControls';

function DrawingCanvas({ lines, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove, currentLine, currentColor }) {
  const containerRef = useRef(null);


  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage
        width={containerRef.current ? containerRef.current.clientWidth : 0} 
        height={window.innerHeight} 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {lines && lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {isDrawing && (
            <Line
              points={currentLine}
              stroke={currentColor}
              strokeWidth={2}
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
