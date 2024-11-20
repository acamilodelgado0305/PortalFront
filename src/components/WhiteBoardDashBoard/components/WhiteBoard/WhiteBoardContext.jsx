import { createContext, useState, useContext } from "react";
import { useWhiteBoardSocket } from "../../WhiteBoardSocketProvider.jsx";
import { events } from "../../../../enums/whiteboardEvents.js";
import { list } from "postcss";

// Crear el contexto
export const WhiteBoardContext = createContext();

const WhiteBoardProvider = ({ children }) => {
  const socket = useWhiteBoardSocket();
  
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [drawingMode, setDrawingMode] = useState("draw");
  const [currentColor, setCurrentColor] = useState("red");
  const [currentDrawTool, setCurrentDrawTool] = useState("line");
  const [lineWidth, setLineWidth] = useState(8);
  // WITHEBOARD TEXT
const [isWriting, setIsWriting] = useState(false)  
const [currentText, setCurrentText] =useState('');
const [currentTextPosition, setCurrentTextPosition] = useState({x:0,y:0});
const [texts, setTexts] = useState([]);
// borton deshacer
const [boardHistory, setBoardHistory] = useState([]);
const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
//flag history
const [isSavingPreviousState, setIsSavingPreviousState] = useState(false);
const [zoom, setZoom] = useState(1)


   const useWhiteBoard = () => {
    return useContext(WhiteBoardContext);
  };

 const [currentPage, setCurrentPage] = useState(1);

 const goToNextPage = (emitToSocket) => {
  setCurrentPage(currentPage + 1); 
  if (emitToSocket && socket) {
    socket.emit(events.GO_TO_NEXT_PAGE); 
  }
};

const goToPreviousPage = (emitToSocket) => {
  setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage); 
  if (emitToSocket && socket) {
    socket.emit(events.GO_TO_PREVIOUS_PAGE); 
  }
};


  const updateDrawTool = (value, emitToSocket) => {
    setDrawingMode("draw")
    setCurrentDrawTool(value);
    if (emitToSocket && socket) {
      socket.emit(events.CHANGE_CURRENT_DRAW_TOOL, value);
    }
  };

  const updateLineWidth = (value, emitToSocket) => {
    setLineWidth(value);
    if (emitToSocket && socket) {
      socket.emit(events.CHANGE_LINE_WIDTH, value);
    }
  };

  const changeColor = (color, emitToSocket) => {
    setCurrentColor(color);
    if (emitToSocket && socket) {
      socket.emit(events.CHANGE_COLOR, color);
    }
  };

  const handleMouseDown = (position, emitToSocket) => {
    setIsDrawing(true);
    setCurrentLine([position.x, position.y]);
    if (emitToSocket && socket) {
      socket.emit(events.MOUSE_DOWN, position);
    }
  };

  const handleMouseMoveDraw = (position, emitToSocket) => {
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
        setCurrentLine([currentLine[0], currentLine[1], radius]); 
      } else if (currentDrawTool === "straightLine" || currentDrawTool === "arrow") {
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
    if (emitToSocket && socket) {
      socket.emit(events.MOUSE_MOVE_DRAW, position);
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
    if(lines.length !== updatedLines.length){
      setIsSavingPreviousState(true)
      saveBoardState(list,texts);
  }
    setLines(updatedLines);
    handleRemoveText(position);

    if (emitToSocket && socket) {
      socket.emit(events.MOUSE_MOVE_ERASE, updatedLines);
    }
  };

const eraseListener = (updatedLines)=>{
  setLines(updatedLines);
}

  const handleMouseUp = (emitToSocket) => {
 
    setIsDrawing(false);
    if (drawingMode === "draw") {
      const newLine = {
        points: currentLine,
        color: currentColor,
        width: lineWidth,
        tool: currentDrawTool,
        page: currentPage 
      };
      setLines([...lines, newLine]); 
      saveBoardState([...lines, newLine],texts);
      }
   
    
    setCurrentLine([]);

    if (emitToSocket && socket) {
      socket.emit(events.MOUSE_UP);
    }
  };

  
const toogleTextMode = (emitToSocket) =>{
    setDrawingMode(drawingMode === "text" ? "draw" : "text");
  if (emitToSocket && socket) {
    socket.emit(events.TOOGLE_TEXT_MODE); 
  }
}
const [zoomType, setZoomType] = useState('in');
const toggleZoomMode = (emitToSocket) => {
  const isZoomIn = zoomType === 'in';
  if (isZoomIn) {
    if (drawingMode !== 'zoom') setDrawingMode('zoom');
    else setZoomType('out');
  } else {
    setDrawingMode('draw');
    setZoomType('in');
  }
  if (emitToSocket && socket) {
    socket.emit(events.TOGGLE_ZOOM_MODE);
  }
};

const toogleDrugMode = (emitToSocket)=>{
  setDrawingMode(drawingMode === "hand" ? "draw" : "hand");
    if (emitToSocket && socket) {
    socket.emit(events.TOOGLE_DRUG_MODE); 
  }
}

const [isgrabbing, setIsGrabbing] = useState(false);


  const toggleDrawingMode = (emitToSocket, type) => {
    if (drawingMode === "text") {
      setDrawingMode("draw");
    } else {
      if(!type)  setDrawingMode("draw");
      setDrawingMode(type);
    }
    if (emitToSocket && socket) {
      socket.emit(events.TOGGLE_DRAWING_MODE, type);
    }
  };



//  TEXT
const setTextPosition = (position, emitToSocket) => {
   if (emitToSocket && socket) { 
    setIsWriting(true);
    socket.emit(events.TEXT_POSITION_INITIALIZED, position); 
  }
  setCurrentTextPosition({ x: position.x, y: position.y });
};

const updateTextContent = (text, emitToSocket) => {
  setCurrentText(text);
  if (emitToSocket && socket) {
    socket.emit(events.CURRENT_TEXT_UPDATED, text); 
  }
};




const addTextToList = (emitToSocket) => {
  saveBoardState(lines,texts);
  setTexts([...texts, { text: currentText, position: currentTextPosition, color: currentColor, page:currentPage }]);
  setCurrentText('');
  setCurrentTextPosition({x: 0, y: 0});
  setIsWriting(false);
  if (emitToSocket && socket) {
    socket.emit(events.TEXT_ADDED);
  }
};

const handleRemoveText = (position) => {
  const tolerance = 10; 

  const filteredTexts = texts.filter((item) => {
    const distanceX = Math.abs(item.position.x - position.x);
    const distanceY = Math.abs(item.position.y - position.y);
    
    return !(distanceX <= tolerance && distanceY <= tolerance);
  });
  
  if(texts.length != filteredTexts.length){
    saveBoardState(lines, texts);
    setIsSavingPreviousState(true);
  }
  
  setTexts(filteredTexts);
};

const clearWhiteBoard = (emitToSocket) => {
   saveBoardState(lines, texts);

  const newLines = lines.filter(line => line.page !== currentPage);
  const newTexts = texts.filter(text => text.page !== currentPage);
  setLines(newLines);
  setTexts(newTexts);

  window.dispatchEvent(new CustomEvent('clearWhiteBoardImages'));

  if (emitToSocket && socket) {
    socket.emit(events.CLEAR_WHITEBOARD);
  }
};

const saveBoardState = (lines, texts) => {
  if(drawingMode === 'erase' && !isSavingPreviousState)  return;
  if(drawingMode === 'erase' && isSavingPreviousState)  setIsSavingPreviousState(false)
  const newHistoryIndex = boardHistory.length;
  setBoardHistory([...boardHistory, { lines, texts }]);
  setCurrentHistoryIndex(newHistoryIndex);
};

const undo = (emitToSocket) => {
  if(currentHistoryIndex > 0){
    const previousState = boardHistory[currentHistoryIndex - 1];
    setCurrentHistoryIndex(currentHistoryIndex - 1);
    setLines(previousState.lines);
    setTexts(previousState.texts);
  } else {
    setCurrentHistoryIndex(currentHistoryIndex - 1);
    setLines([]);
    setTexts([]);
  }

  if (emitToSocket && socket) {
    socket.emit(events.UNDO_BOARD_STATE);
  } 
};

const redo = (emitToSocket) => {
  if (currentHistoryIndex < boardHistory.length - 1) {
    const nextState = boardHistory[currentHistoryIndex + 1];
    setCurrentHistoryIndex(currentHistoryIndex + 1);
    setLines(nextState.lines);
    setTexts(nextState.texts);
  }
  if (emitToSocket && socket) {
    socket.emit(events.REDO_BOARD_STATE);
  } 
};

const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

const zoomOnPosition  = (position, stage, emitToSocket)  =>{
  if (emitToSocket && socket) {
    const zoomFactor = zoomType == 'in' ? 1.1 : 0.9; 
    const newZoom = zoom * zoomFactor;

    const newX = position.x - (position.x - stage.x()) * (newZoom / zoom);
    const newY = position.y - (position.y - stage.y()) * (newZoom / zoom);

    setZoom(newZoom);
    setStagePosition({ x: newX, y: newY });
    socket.emit(events.ZOOM_ON_POSITION, {newZoom, stage:{ x: newX, y: newY }});
  } 
}

const zoomListener = (newZoom, stage) =>{
  setZoom(newZoom);
  setStagePosition(stage);
}

const zoomIn = (position, stage, emitToSocket) => {
  setZoomType('in');
  zoomOnPosition(position, stage, emitToSocket);
};

const zoomOut = (position, stage, emitToSocket) => {
  setZoomType('out');
  zoomOnPosition(position, stage, emitToSocket);
};



  return (
    <WhiteBoardContext.Provider
      value={{
        zoomOut,
        zoomIn,
        eraseListener,
        isgrabbing, 
        setIsGrabbing,
        zoom, 
        stagePosition,
        zoomOnPosition,
        zoomListener,
        zoomType,
        toggleZoomMode,
        currentPage,
        goToPreviousPage,
        goToNextPage,
        redo,
        undo, 
        toogleDrugMode,
        isWriting,
        addTextToList,
        texts,
        setTexts,
        setCurrentTextPosition,
        updateTextContent, 
        currentTextPosition,
        setCurrentText,
        currentText,
        setTextPosition,
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
        updateDrawTool,
        handleMouseDown,
        handleMouseUp,
        handleMouseMoveDraw,
        handleMouseMoveErase,
        toggleDrawingMode,
        lineWidth,
        updateLineWidth,
        clearWhiteBoard
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};
export default WhiteBoardProvider;
