import { createContext, useState, useContext } from "react";
import { useWhiteBoardSocket } from "../../WhiteBoardSocketProvider.jsx";

// Crear el contexto
export const WhiteBoardContext = createContext();

const WhiteBoardProvider = ({ children }) => {
  const socket = useWhiteBoardSocket();
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState("draw");
  const [currentColor, setCurrentColor] = useState("red");
  const [currentDrawTool, setCurrentDrawTool] = useState("rectangle"); // line rectangle
  const [lineWidth, setLineWidth] = useState(2);

  const useWhiteBoard = () => {
    return useContext(WhiteBoardContext);
  };

  const changeCurrentDrawTool = (value, emitToSocket) => {
    setCurrentDrawTool(value);
    if (emitToSocket && socket) {
      socket.emit("changeCurrentDrawTool", value);
    }
  };

  const changeLineWidth = (value, emitToSocket) => {
    setLineWidth(value);
    if (emitToSocket && socket) {
      socket.emit("changeLineWidth", value);
    }
  };

  const changeColor = (newColor, emitToSocket) => {
    setCurrentColor(newColor);

    if (emitToSocket && socket) {
      socket.emit("changeColor", newColor);
    }
  };

  const handleMouseDown = (position, emitToSocket) => {
    setIsDrawing(true);
    setCurrentLine([position.x, position.y]);

    if (emitToSocket && socket) {
      socket.emit("mouseDown", position);
    }
  };

  const handleMouseMoveDraw = (position) => {
    if (drawingMode === "draw") {
      if (currentDrawTool === "rectangle") {
        setCurrentLine([
          currentLine[0],
          currentLine[1],
          position.x,
          position.y,
        ]);
      } else if (currentDrawTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(position.x - currentLine[0], 2) +
            Math.pow(position.y - currentLine[1], 2),
        );
        setCurrentLine([currentLine[0], currentLine[1], radius]); // Guardar centro y radio
      } else if (currentDrawTool === "straightLine") {
        // Mantener la línea recta perfecta como un rectángulo
        setCurrentLine([
          currentLine[0],
          currentLine[1],
          position.x,
          position.y,
        ]);
      } else {
        setCurrentLine([...currentLine, position.x, position.y]);
      }
    }

    // Emitir el evento al socket (si aplica)
    if (emitToSocket && socket) {
      socket.emit("mouseMoveDraw", position);
    }
  };

  const handleMouseMoveErase = (position, emitToSocket) => {
    if(drawingMode != 'erase')return

    const updatedLines = lines.filter((line) => {
      const { points, tool } = line;
      let shouldDeleteLine = false;

      if (tool === "rectangle") {
        const [x1, y1, x2, y2] = points;

        if (
          position.x >= Math.min(x1, x2) &&
          position.x <= Math.max(x1, x2) &&
          position.y >= Math.min(y1, y2) &&
          position.y <= Math.max(y1, y2)
        ) {
          shouldDeleteLine = true;
        }
      } else if (tool === "circle") {
        const [cx, cy, radius] = points;
        const distanceToCenter = Math.sqrt(
          Math.pow(position.x - cx, 2) + Math.pow(position.y - cy, 2),
        );

        if (distanceToCenter < radius) {
          shouldDeleteLine = true;
        }
      } else {
        for (let i = 0; i < points.length; i += 2) {
          const x = points[i];
          const y = points[i + 1];
          const distanceToCursor = Math.sqrt(
            Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2),
          );
          if (distanceToCursor < 10) {
            shouldDeleteLine = true;
            break;
          }
        }
      }

      return !shouldDeleteLine;
    });

    setLines(updatedLines);

    if (emitToSocket && socket) {
      socket.emit("mouseMoveErase", updatedLines);
    }
  };

  const erase = (updatedLines) => {
    setLines([]);
    setLines(updatedLines);
  };

const toogleTextMode = (emitToSocket) =>{
    setDrawingMode(drawingMode === "text" ? "draw" : "text");
  if (emitToSocket && socket) {
    socket.emit("toogleTextMode"); //falta hacer SOCKET
  }
}


  const toggleDrawingMode = (emitToSocket) => {
    if (drawingMode === "text") {
      setDrawingMode("draw");
    } else {
      setDrawingMode(drawingMode === "draw" ? "erase" : "draw");
    }
    if (emitToSocket && socket) {
      socket.emit("toggleDrawingMode");
    }
  };

  const handleMouseUp = (emitToSocket) => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (drawingMode === "draw") {
      // Almacenar la línea o forma actual
      const newLine = {
        points: currentLine,
        color: currentColor,
        width: lineWidth,
        tool: currentDrawTool, // Aquí guardamos la forma actual
      };
      setLines([...lines, newLine]);
    }

    setCurrentLine([]);

    if (emitToSocket && socket) {
      socket.emit("mouseUp");
    }
  };

  return (
    <WhiteBoardContext.Provider
      value={{
        useWhiteBoard,
        lines,
        setLines,
        isDrawing,
        setIsDrawing,
        currentLine,
        setCurrentLine,
        currentDrawTool,
        setCurrentDrawTool,
        drawingMode,
        setDrawingMode,
        toogleTextMode,
        currentColor,
        changeColor,
        changeCurrentDrawTool,
        handleMouseDown,
        handleMouseUp,
        handleMouseMoveDraw,
        handleMouseMoveErase,
        erase,
        toggleDrawingMode,
        lineWidth,
        changeLineWidth,
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};
export default WhiteBoardProvider;