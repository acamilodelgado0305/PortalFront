import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Group, Text } from "react-konva";
import TextInput from "./TextInput";

function DrawingCanvas({ context }) {
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
    if (context.drawingMode === "draw") {
      context.handleMouseMoveDraw(position, emitToSocket);
    } else {
      context.handleMouseMoveErase(position, emitToSocket);
    }
  };

  const handleMouseDown = (e) => {
    const position = e.target.getStage().getPointerPosition();
    if (context.drawingMode === "text") {
      context.setTextPosition(position, emitToSocket);
      return;
    }
    context.handleMouseDown(position, emitToSocket);
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseUp={() => context.handleMouseUp(emitToSocket)}
        onMouseMove={handleMove}
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

  return (
    <>
      {context.currentDrawTool === "rectangle" ? (
        <Rect
          x={Math.min(context.currentLine[0], context.currentLine[2])}
          y={Math.min(context.currentLine[1], context.currentLine[3])}
          width={Math.abs(context.currentLine[2] - context.currentLine[0])}
          height={Math.abs(context.currentLine[3] - context.currentLine[1])}
          fill={null}
          stroke={context.currentColor}
          strokeWidth={context.lineWidth}
        />
      ) : context.currentDrawTool === "circle" ? (
        <Circle
          x={context.currentLine[0]}
          y={context.currentLine[1]}
          radius={context.currentLine[2]}
          fill={null}
          stroke={context.currentColor}
          strokeWidth={context.lineWidth}
        />
      ) : context.currentDrawTool === "straightLine" ? (
        <Line
          points={[
            context.currentLine[0],
            context.currentLine[1],
            context.currentLine[2],
            context.currentLine[3],
          ]}
          stroke={context.currentColor}
          strokeWidth={context.lineWidth}
          tension={0}
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
      )}
    </>
  );
};

export default DrawingCanvas;
