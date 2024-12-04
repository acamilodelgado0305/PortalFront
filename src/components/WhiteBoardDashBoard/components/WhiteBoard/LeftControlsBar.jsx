import { useState, useEffect } from "react";
import {
  FaCircle,
  FaRegSquare,
  FaRegCircle,
  FaLongArrowAltRight,
  FaRegHandPaper,
  FaRegHandRock,
} from "react-icons/fa";
import {
  IoColorPaletteOutline,
  IoReturnUpBack,
  IoReturnUpForward,
} from "react-icons/io5";
import { BsPencil, BsEraser, BsZoomIn, BsZoomOut } from "react-icons/bs";
import { FloatButton } from "antd";
import { FontColorsOutlined } from "@ant-design/icons";
import { BiMinus } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
// GLOBAL
const emitToSocket = true;
const shapeForm = "square" || "circle";
import sizeIcon from "./utils/size-icon.svg";

const PCStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "45px",
  height: "45px",
  cursor: "pointer",
  borderRadius: "10px",
};

const movilStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "33px",
  height: "33px",
  cursor: "pointer",
  borderRadius: "10px",
};

function LeftControlsBar({ context }) {
  const [style, setStyle] = useState(
    window.innerWidth < 640 ? movilStyle : PCStyle,
  );
  const [isMovil, setIsMovil] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setStyle(window.innerWidth < 640 ? movilStyle : PCStyle);
      setIsMovil(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute z-[99] flex h-full flex-col gap-1 bg-[#FFFFFF] py-2 pr-2">
      <PencilEraserToggleButton context={context} style={style} />
      <TextBotton context={context} style={style} />
      <LineWidthPickerButton
        context={context}
        style={style}
        isMovil={isMovil}
      />
      <ColorOptionButton context={context} style={style} isMovil={isMovil} />
      <UndoRedoButtons context={context} style={style} />
      <CurrentDrawToolPickerButtons context={context} style={style} />
      <TrashBinClearerButton context={context} style={style} />
      <ZoomButton context={context} style={style} />
      <DruggerButton context={context} style={style} />
    </div>
  );
}
export default LeftControlsBar;

const TrashBinClearerButton = ({ context, style }) => {
  return (
    <div
      className="trash-bin-button"
      onClick={() => context.clearWhiteBoard(emitToSocket)}
      style={style}
    >
      <RiDeleteBin6Line size={30} />
    </div>
  );
};
const UndoRedoButtons = ({ context, style }) => (
  <>
    <div
      className="static"
      style={style}
      shape={shapeForm}
      onClick={() => context.undo(emitToSocket)}
    >
      {" "}
      <IoReturnUpBack size={25} />
    </div>
    <div
      className="static"
      style={style}
      shape={shapeForm}
      onClick={() => context.redo(emitToSocket)}
    >
      {" "}
      <IoReturnUpForward size={25} />
    </div>
  </>
);

const ZoomButton = ({ context, style }) => {
  return (
    <div
      className="static"
      style={{
        ...style,
        background: context.drawingMode === "zoom" ? "#1677ff" : "",
        color: context.drawingMode === "zoom" ? "white" : "",
      }}
      shape={shapeForm}
      onClick={context.toggleZoomMode}
    >
      {context.zoomType == "in" ? (
        <BsZoomIn size={30} />
      ) : (
        <BsZoomOut size={30} />
      )}
    </div>
  );
};

const PencilEraserToggleButton = ({ context, style }) => {
  return (
    <>
      <div
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toggleDrawingMode(emitToSocket, "draw");
          context.updateDrawTool("line", emitToSocket);
        }}
        style={{
          ...style,
          background:
            context.drawingMode === "draw" && context.currentDrawTool === "line"
              ? "#1677ff"
              : "",
          color:
            context.drawingMode === "draw" && context.currentDrawTool === "line"
              ? "white"
              : "",
        }}
      >
        <BsPencil size={30} />
      </div>
      <div
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toggleDrawingMode(emitToSocket, "erase");
        }}
        style={{
          ...style,
          background: context.drawingMode === "erase" ? "#1677ff" : "",
          color: context.drawingMode === "erase" ? "white" : "",
        }}
      >
        {" "}
        <BsEraser size={30} />
      </div>
    </>
  );
};

const ColorOptionButton = ({ context, style, isMovil }) => {
  const [show, setShow] = useState(false);
  const colors = ["red", "blue", "green", "yellow"];
  return (
    <>
      {show && (
        <>
          {colors.map((color, index) => (
            <FloatButton
              shape={shapeForm}
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
        </>
      )}
      <div
        className="static"
        shape={shapeForm}
        onClick={() => setShow(!show)}
        style={style}
      >
        <IoColorPaletteOutline size={30} />
      </div>
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
          onChange={(e) =>
            context.updateLineWidth(Number(e.target.value), emitToSocket)
          }
          style={{
            position: "absolute",
            top: !isMovil ? 169 : 129,
            left: 55,
            cursor: "pointer",
          }}
        />
      )}
      <div
        className="static"
        shape={shapeForm}
        type={"danger"}
        onClick={() => setShow(!show)}
        style={style}
      >
        <img
          src={sizeIcon}
          alt="Size Icon"
          style={{ width: "30px", height: "30px" }}
        />
      </div>
    </>
  );
};

const CurrentDrawToolPickerButtons = ({ context, style }) => {
  const tools = [
    { name: "rectangle", icon: <FaRegSquare size={30} /> },
    { name: "circle", icon: <FaRegCircle size={30} /> },
    { name: "straightLine", icon: <BiMinus size={30} /> },
    {
      name: "arrow",
      icon: (
        <FaLongArrowAltRight
          size={30}
          style={{ height: "40%", width: "120%" }}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-1">
      {tools.map((tool, index) => (
        <div
          className="static"
          shape={shapeForm}
          style={{
            ...style,
            background:
              context.currentDrawTool === tool.name &&
              context.drawingMode === "draw"
                ? "#1677ff"
                : "",
            color:
              context.currentDrawTool === tool.name &&
              context.drawingMode === "draw"
                ? "white"
                : "",
          }}
          key={tool.name}
          onClick={() => context.updateDrawTool(tool.name, emitToSocket)}
          icon={tool.icon}
        >
          {" "}
          {tool.icon}
        </div>
      ))}
    </div>
  );
};

const TextBotton = ({ context, style }) => {
  return (
    <>
      <div
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toogleTextMode(emitToSocket);
        }}
        style={{
          ...style,
          background: context.drawingMode === "text" ? "#1677ff" : "",
          color: context.drawingMode === "text" ? "white" : "",
        }}
      >
        <FontColorsOutlined style={{ fontSize: "30px" }} />
      </div>
    </>
  );
};

const DruggerButton = ({ context, style }) => {
  return (
    <>
      <div
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toogleDrugMode(emitToSocket);
        }}
        style={{
          ...style,
          background: context.drawingMode === "hand" ? "#1677ff" : "",
          color: context.drawingMode === "hand" ? "white" : "",
        }}
      >
        {context.drawingMode === "hand" ? (
          <FaRegHandRock size={30} />
        ) : (
          <FaRegHandPaper size={30} />
        )}
      </div>
    </>
  );
};
