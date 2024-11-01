import { Stage, Layer, Line } from 'react-konva';

function DrawingCanvas({ lines, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove, currentLine }) {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        {lines && lines.map((line, index) => (
          <Line
            key={index}
            points={line}
            stroke="red"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        {isDrawing && (
          <Line
            points={currentLine}
            stroke="red"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Layer>
    </Stage>
  );
}

export default DrawingCanvas;
