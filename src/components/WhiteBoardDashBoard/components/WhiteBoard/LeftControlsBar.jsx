import { useState, useEffect, useCallback } from "react";
import {
  FaCircle,
  FaRegSquare,
  FaRegCircle,
  FaLongArrowAltRight,
  FaRegHandPaper,
  FaRegHandRock,
} from "react-icons/fa";
import { IoColorPaletteOutline, IoReturnUpBack, IoReturnUpForward } from "react-icons/io5";
import { BsPencil, BsEraser, BsZoomIn, BsZoomOut } from "react-icons/bs";
import { FloatButton } from "antd";
import { FontColorsOutlined } from "@ant-design/icons";
import { BiMinus } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import sizeIcon from "./utils/size-icon.svg";

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
    <RiDeleteBin6Line size={30} />
  </Button>
);

const UndoRedoButtons = ({ context, style }) => (
  <>
    <Button
      onClick={() => context.undo(emitToSocket)}
      style={style}
      activeCondition={false}
    >
      <IoReturnUpBack size={25} />
    </Button>
    <Button
      onClick={() => context.redo(emitToSocket)}
      style={style}
      activeCondition={false}
    >
      <IoReturnUpForward size={25} />
    </Button>
  </>
);

const ZoomButton = ({ context, style }) => (
  <Button
    onClick={context.toggleZoomMode}
    style={style}
    activeCondition={context.drawingMode === "zoom"}
  >
    {context.zoomType === "in" ? <BsZoomIn size={30} /> : <BsZoomOut size={30} />}
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
      <BsPencil size={30} />
    </Button>
    <Button
      onClick={() => {
        context.toggleDrawingMode(emitToSocket, "erase");
      }}
      style={style}
      activeCondition={context.drawingMode === "erase"}
    >
      <BsEraser size={30} />
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
        <IoColorPaletteOutline size={30} />
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
  const tools = [
    { name: "rectangle", icon: <FaRegSquare size={30} /> },
    { name: "circle", icon: <FaRegCircle size={30} /> },
    { name: "straightLine", icon: <BiMinus size={30} /> },
    { name: "arrow", icon: <FaLongArrowAltRight size={30} style={{ height: "40%", width: "120%" }} /> },
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
    <FontColorsOutlined style={{ fontSize: "30px" }} />
  </Button>
);

const DruggerButton = ({ context, style }) => (
  <Button
    onClick={() => context.toogleDrugMode(emitToSocket)}
    style={style}
    activeCondition={context.drawingMode === "hand"}
  >
    {context.drawingMode === "hand" ? <FaRegHandRock size={30} /> : <FaRegHandPaper size={30} />}
  </Button>
);

export default LeftControlsBar;
