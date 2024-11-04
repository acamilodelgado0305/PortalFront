import { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

function DrawingCanvas({context}) {
  const containerRef = useRef(null);
  const emitToSocket = true;   
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage
        width={containerRef.current ? containerRef.current.clientWidth : 0} 
        height={window.innerHeight} 
        onMouseDown={(e)=>context.handleMouseDown(e.target.getStage().getPointerPosition(), emitToSocket)}
        onMouseUp={()=>context.handleMouseUp(emitToSocket)}
        onMouseMove={( context.drawingMode === 'draw' ) ? ((e)=>context.handleMouseMoveDraw(e.target.getStage().getPointerPosition(), emitToSocket )) : ((e)=>context.handleMouseMoveErase(e.target.getStage().getPointerPosition(), emitToSocket ))}
      >
        <Layer>
          {context.lines && context.lines.map((line, index) => (
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
          {context.isDrawing && (
            <Line
              points={context.currentLine}
              stroke={context.currentColor}
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
