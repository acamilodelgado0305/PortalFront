import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Group, Text, Arrow  } from "react-konva";
import TextInput from "./TextInput";

function DrawingCanvas({ context }) {
  if(!context) return
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const emitToSocket = true;

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  const handleMove = (e) => {
    const position = e.target.getStage().getPointerPosition();
    const adjustedPos = {
      x: (position.x - context.stagePosition.x) / context.zoom,
      y: (position.y - context.stagePosition.y) / context.zoom,
    };

    if (context.drawingMode === "draw") {
      context.handleMouseMoveDraw(adjustedPos, emitToSocket);
    } else {
      context.handleMouseMoveErase(adjustedPos, emitToSocket);
    }
  };

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const position = e.target.getStage().getPointerPosition();

    if (context.drawingMode === 'hand') {
      context.setIsGrabbing(true); 
    }


    if (context.drawingMode === "text") {
      context.setTextPosition(position, emitToSocket);
      return;
    } else if(context.drawingMode === "zoom"){
      context.zoomOnPosition(position, stage, emitToSocket)
    }

    context.handleMouseDown(position, emitToSocket);
  };

  const handleWheelZoom = (event) => {
    const stage = event.target.getStage();
    const position = event.target.getStage().getPointerPosition();
    if (event.evt.deltaY < 0) {
      // porque siempre entra aqui, sin importar si me alejo o me acerco
      context.zoomIn(position, stage, emitToSocket);
    } else {
      // Zoom out
      context.zoomOut(position, stage, emitToSocket);
    }
  };

  return (
    <div ref={containerRef}        style={{ width: "100%", height: "100%" }} className={(context?.drawingMode === 'hand') && "drag-whiteboard-handle"} >
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        scaleX={context.zoom}
        scaleY={context.zoom}
        x={context.stagePosition.x}
        y={context.stagePosition.y}
        onMouseDown={handleMouseDown}
        onMouseUp={() => {
          context.setIsGrabbing(false); 
          context.handleMouseUp(emitToSocket);}}
        onMouseMove={handleMove}
        onWheel={handleWheelZoom}
   
      
      >
        <Layer>
          <Group>
            <ShapesLayer context={context} />
            <CurrentShape context={context} />
          </Group>

          {context.texts
            .filter((item) => item.page === context.currentPage)
            .map((item, index) => (
              <Text
                key={index}
                x={item.position.x}
                y={item.position.y}
                text={item.text}
                fontSize={20}
                fill={item.color || "black"}
              />
            ))}
        </Layer>
      </Stage>
      <TextInput context={context} />
    </div>
  );
}

const ShapesLayer = ({ context }) => {
  return (
    <>
      {context.lines &&
        context.lines
          .filter((line) => line.page === context.currentPage) // Filtrar por la página actual
          .map((line, index) => {
            if (line.tool === "rectangle") {
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
            } else if (line.tool === "circle") {
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
            } else if (line.tool === "arrow") {
              const [x1, y1, x2, y2] = line.points;

              return (
                <Arrow
                  key={index}
                  points={[x1, y1, x2, y2]}  // Definir los puntos de la flecha (origen y destino)
                  fill={line.color}             // Color de la flecha
                  stroke={line.color}           // Color del borde de la flecha
                  strokeWidth={line.width || 2} // Ancho del borde de la flecha
                  tension={0}
                  pointerLength={10}            // Longitud de la cabeza de la flecha
                  pointerWidth={10}             // Ancho de la cabeza de la flecha
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
    </>
  );
};



const CurrentShape = ({ context }) => {
  if (!context.isDrawing) return null;

  if (context.currentDrawTool === "rectangle") {
    return (
      <Rect
        x={Math.min(context.currentLine[0], context.currentLine[2])}
        y={Math.min(context.currentLine[1], context.currentLine[3])}
        width={Math.abs(context.currentLine[2] - context.currentLine[0])}
        height={Math.abs(context.currentLine[3] - context.currentLine[1])}
        fill={null}
        stroke={context.currentColor}
        strokeWidth={context.lineWidth}
      />
    );
  }

  if (context.currentDrawTool === "circle") {
    return (
      <Circle
        x={context.currentLine[0]}
        y={context.currentLine[1]}
        radius={context.currentLine[2]}
        fill={null}
        stroke={context.currentColor}
        strokeWidth={context.lineWidth}
      />
    );
  }

  if (context.currentDrawTool === "straightLine") {
    return (
      <Line
        points={[context.currentLine[0], context.currentLine[1], context.currentLine[2], context.currentLine[3]]}
        stroke={context.currentColor}
        strokeWidth={context.lineWidth}
        tension={0}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  if (context.currentDrawTool === "arrow") {
    return (
      <Arrow
        points={[
          context.currentLine[0], 
          context.currentLine[1], 
          context.currentLine[2], 
          context.currentLine[3], 
        ]}
        stroke={context.currentColor}
        strokeWidth={context.lineWidth}
        fill={context.currentColor}
        pointerLength={15} 
        pointerWidth={10}  
      />
    );
  }

  return (
    <Line
      points={context.currentLine}
      stroke={context.currentColor}
      strokeWidth={context.lineWidth}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
    />
  );
};


export default DrawingCanvas;
