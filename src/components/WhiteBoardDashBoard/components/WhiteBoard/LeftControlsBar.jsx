import { useState, useEffect, useCallback } from "react";
import { FaCircle } from "react-icons/fa";
import { FloatButton } from "antd";

import pencilBlack from "./utils/pencil-black.svg";
import zoomPlusBlack from "./utils/zoom plus black.svg";
import zoomMinusBlack from './utils/zoom minus black.svg';
import undoBlack from "./utils/undo-black.svg";
import redoBlack from "./utils/redo-black.svg";
import trashBlack from './utils/trash-black.svg';
import textIconBlack from "./utils/text-icon-black.svg";
import straightBlack from "./utils/straight-black.svg";
import squareIconBlack from "./utils/square-icon-black.svg";
import sizeIcon from "./utils/size-icon.svg";
import segmentIconBlack from "./utils/segment-icon-black.svg";
import colorPaletteBlack from "./utils/color-palette-black.svg";
import circleBlack from "./utils/circle-black.svg";
import handIconBlack from "./utils/hand-icon-black.svg";
import eraserBlack from "./utils/eraser-black.svg";






// GLOBAL
const emitToSocket = true;
const shapeForm = "square" || "circle";

// Estilos
const getStyle = (isMovil) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: isMovil ? "33px" : "45px",
  height: isMovil ? "33px" : "45px",
  cursor: "pointer",
  borderRadius: "10px",
});

function LeftControlsBar({ context }) {
  const [isMovil, setIsMovil] = useState(window.innerWidth < 640);
  const style = getStyle(isMovil);

  const handleResize = useCallback(() => {
    setIsMovil(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="absolute z-[99] flex h-full flex-col gap-1 bg-[#FFFFFF] py-2 pr-2">
      <PencilEraserToggleButton context={context} style={style} />
      <TextButton context={context} style={style} />
      <LineWidthPickerButton context={context} style={style} isMovil={isMovil} />
      <ColorOptionButton context={context} style={style} isMovil={isMovil} />
      <UndoRedoButtons context={context} style={style} />
      <CurrentDrawToolPickerButtons context={context} style={style} />
      <TrashBinClearerButton context={context} style={style} />
      <ZoomButton context={context} style={style} />
      <DruggerButton context={context} style={style} />
    </div>
  );
}

const Button = ({ children, onClick, style, activeCondition, activeStyle }) => (
  <div
    className="static"
    onClick={onClick}
    style={{
      ...style,
      background: activeCondition ? "#1677ff" : "",
      color: activeCondition ? "white" : "",
      ...activeStyle,
    }}
  >
    {children}
  </div>
);

const TrashBinClearerButton = ({ context, style }) => (
  <Button
    onClick={() => context.clearWhiteBoard(emitToSocket)}
    style={style}
  >
    {/* trashBlack */}
    <img src={trashBlack}  alt="uploadBlack Icon" style={{ width: "30px", height: "30px" }}/>
  </Button>
);

const UndoRedoButtons = ({ context, style }) => (
  <>
    <Button
      onClick={() => context.undo(emitToSocket)}
      style={style}
      activeCondition={false}
    >
    <img src={undoBlack}  alt="uploadBlack Icon" style={{ width: "30px", height: "30px" }}/>
    </Button>
    <Button
      onClick={() => context.redo(emitToSocket)}
      style={style}
      activeCondition={false}
    >
       <img 
  src={redoBlack} 
  alt="redoBlack Icon" 
  style={{ 
    width: "30px", 
    height: "30px", 
  }} 
/>

    </Button>
  </>
);

const ZoomButton = ({ context, style }) => (
  <Button
    onClick={context.toggleZoomMode}
    style={style}
    activeCondition={context.drawingMode === "zoom"}
  >
    {context.zoomType === "in" ? <img src={zoomPlusBlack}  alt="Zoom plusIcon" style={{ width: "30px", height: "30px" }}/> : <img src={zoomMinusBlack}  alt="Zoom munus Icon" style={{ width: "30px", height: "30px" }}/>}
  </Button>
);

const PencilEraserToggleButton = ({ context, style }) => (
  <>
    <Button
      onClick={() => {
        context.toggleDrawingMode(emitToSocket, "draw");
        context.updateDrawTool("line", emitToSocket);
      }}
      style={style}
      activeCondition={context.drawingMode === "draw" && context.currentDrawTool === "line"}
    >
          <img 
  src={pencilBlack} 
  alt="pencilBlack Icon" 
  style={{ 
    width: "30px", 
    height: "30px", 
  }} 
/>
    </Button>
    <Button
      onClick={() => {
        context.toggleDrawingMode(emitToSocket, "erase");
      }}
      style={style}
      activeCondition={context.drawingMode === "erase"}
    >
      <img 
  src={eraserBlack} 
  alt="eraserBlack Icon" 
  style={{ 
    width: "30px", 
    height: "30px", 
  }} 
/>
    </Button>
  </>
);

const ColorOptionButton = ({ context, style, isMovil }) => {
  const [show, setShow] = useState(false);
  const colors = ["red", "blue", "green", "yellow"];
  return (
    <>
      {show && colors.map((color, index) => (
        <FloatButton
          key={color}
          onClick={() => context.changeColor(color, emitToSocket)}
          style={{
            position: "absolute",
            height: "43px",
            width: "43px",
            left: 50 + index * 50,
            top: !isMovil ? 205 : 150,
          }}
          icon={<FaCircle color={color} />}
        />
      ))}
      <Button
        onClick={() => setShow(!show)}
        style={style}
        activeCondition={false}
      >
        <img src={colorPaletteBlack}  alt="uploadBlack Icon" style={{ width: "30px", height: "30px" }}/>
      </Button>
    </>
  );
};

const LineWidthPickerButton = ({ context, style, isMovil }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && (
        <input
          type="range"
          id="lineWidth"
          min="1"
          max="20"
          value={context?.lineWidth || 2}
          onChange={(e) => context.updateLineWidth(Number(e.target.value), emitToSocket)}
          style={{
            position: "absolute",
            top: !isMovil ? 169 : 129,
            left: 55,
            cursor: "pointer",
          }}
        />
      )}
      <Button
        onClick={() => setShow(!show)}
        style={style}
        activeCondition={false}
      >
        <img src={sizeIcon} alt="Size Icon" style={{ width: "30px", height: "30px" }} />
      </Button>
    </>
  );
};

const CurrentDrawToolPickerButtons = ({ context, style }) => {
  // circleBlack
  const tools = [
    { name: "rectangle", icon: <img src={squareIconBlack} alt="squareIconBlack Icon" style={{ width: "30px", height: "30px" }} /> },
    { name: "circle", icon: <img src={circleBlack} alt="circleBlack Icon" style={{ width: "30px", height: "30px" }} />  },
    { name: "straightLine", icon:  <img src={segmentIconBlack} alt="segmentIconBlack Icon" style={{ width: "30px", height: "30px" }} /> },
    { name: "arrow", icon:  <img src={straightBlack} alt="straightBlack Icon" style={{ width: "30px", height: "30px" }} /> },
  ];
  return (
    <div className="flex flex-col gap-1">
      {tools.map((tool) => (
        <Button
          key={tool.name}
          onClick={() => context.updateDrawTool(tool.name, emitToSocket)}
          style={style}
          activeCondition={context.currentDrawTool === tool.name && context.drawingMode === "draw"}
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  );
};

const TextButton = ({ context, style }) => (
  <Button
    onClick={() => context.toogleTextMode(emitToSocket)}
    style={style}
    activeCondition={context.drawingMode === "text"}
  >
    <img src={textIconBlack} alt="Text Icon" style={{ width: "30px", height: "30px" }} />
  </Button>
);

const DruggerButton = ({ context, style }) => (
  <Button
    onClick={() => context.toogleDrugMode(emitToSocket)}
    style={style}
    activeCondition={context.drawingMode === "hand"}
  >
    <img src={handIconBlack} alt="Text Icon" style={{ width: "30px", height: "30px" }} /> 
  </Button>
);

export default LeftControlsBar;
