import { useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';


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
        onMouseMove={(e) => {
          const position = e.target.getStage().getPointerPosition();
          if (context.drawingMode === 'draw') {
            context.handleMouseMoveDraw(position, emitToSocket);
          } else {
            context.handleMouseMoveErase(position, emitToSocket);
          }
        }}
      >
        <LayerForm context={context} />
      </Stage>
    </div>
  );
}

const LayerForm = ({ context }) => {
  return (
    <Layer>
      {context.lines && context.lines.map((line, index) => {
        if (line.tool === 'rectangle') {
          const [x1, y1, x2, y2] = line.points; 
          return (
            <Rect
              key={index}
              x={Math.min(x1, x2)} 
              y={Math.min(y1, y2)} 
              width={Math.abs(x2 - x1)}
              height={Math.abs(y2 - y1)}
              fill={null} 
              stroke={line.color} 
              strokeWidth={line.width} 
            />
          );
        } else if (line.tool === 'circle') {
          const [cx, cy, radius] = line.points;
          return (
            <Circle
              key={index}
              x={cx}
              y={cy}
              radius={radius}
              fill={null}
              stroke={line.color}
              strokeWidth={line.width}
            />
          );
        } else {
          return (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width || 2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          );
        }
      })}
      {context.isDrawing && (
        <>
          {context.currentDrawTool === 'rectangle' ? (
            <Rect
              x={Math.min(context.currentLine[0], context.currentLine[2])}
              y={Math.min(context.currentLine[1], context.currentLine[3])}
              width={Math.abs(context.currentLine[2] - context.currentLine[0])}
              height={Math.abs(context.currentLine[3] - context.currentLine[1])}
              fill={null}
              stroke={context.currentColor}
              strokeWidth={context.lineWidth}
            />
          ) : context.currentDrawTool === 'circle' ? (
            <Circle
              x={context.currentLine[0]}
              y={context.currentLine[1]}
              radius={context.currentLine[2]}
              fill={null}
              stroke={context.currentColor}
              strokeWidth={context.lineWidth}
            />
          ) :(context.currentDrawTool === 'straightLine' ? (
            <Line
              points={[context.currentLine[0], context.currentLine[1], context.currentLine[2], context.currentLine[3]]}
              stroke={context.currentColor}
              strokeWidth={context.lineWidth}
              tension={0} // Sin tensión para líneas rectas
              lineCap="round"
              lineJoin="round"
            />
          ) : (
            <Line
              points={context.currentLine}
              stroke={context.currentColor}
              strokeWidth={context.lineWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </>
      )}
    </Layer>
  );
};


export default DrawingCanvas;
