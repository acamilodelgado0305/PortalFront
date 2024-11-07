import { useState } from "react";
import {
  FaCircle,
  FaRegSquare,
  FaRegCircle,
  FaLongArrowAltRight,
  FaRegHandPaper, 
  FaRegHandRock
} from "react-icons/fa";
import { IoColorPaletteOutline, IoReturnUpBack, IoReturnUpForward } from "react-icons/io5";
import { BsPencil, BsEraser, BsZoomIn, BsZoomOut } from "react-icons/bs";
import { FloatButton } from "antd";
import {
  HighlightOutlined,
  SignatureOutlined,
  LineOutlined,
  FontColorsOutlined 
} from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
// GLOBAL
const emitToSocket = true;
const shapeForm =  "square"||"circle"; 

function LeftControlsBar({ context }) {


  return (
    <div className="flex gap-1 flex-col py-2 pl-2 absolute h-full bg-[#FFFFFF] z-[99]">
      <DruggerButton context={context} /> 
      <TextBotton  context={context} />
      <CurrentDrawToolPickerButtons context={context} />
      <LineWidthPickerButton context={context} />
      <ColorOptionButton context={context} />
      <PencilEraserToggleButton  context={context} />
      <TrashBinClearerButton context={context}/>
      <ZoomButton context={context}/>
      <UndoRedoButtons context={context} />
    </div>
  );
}
export default LeftControlsBar;






const TrashBinClearerButton = ({context}) => {
  return (<>
      <FloatButton
       className="static"
       shape={shapeForm}
       onClick={()=>context.clearWhiteBoard(emitToSocket)}
       icon={<RiDeleteBin6Line/>}
      />
  </>)
}
const UndoRedoButtons = ({ context }) => (
  <>
    {/* Botón para deshacer */}
    <FloatButton
      className="static"
      shape={shapeForm}
      icon={<IoReturnUpBack />}
    />
    {/* Botón para rehacer */}
    <FloatButton
      className="static"
      shape={shapeForm}
      icon={<IoReturnUpForward />}
    />
  </>
);


const ZoomButton = ({context}) =>{
  return(
    <>
      <FloatButton
       className="static"
       shape={shapeForm}
       icon={true ? <BsZoomIn/> :<BsZoomOut /> }
       />
    </>
  )
}


const PencilEraserToggleButton = ({context}) =>{
  return (<>
   <FloatButton
       className="static"
       shape={shapeForm}
       onClick={() => { context.toggleDrawingMode(emitToSocket); 
        }}
        type={"primary"}
        icon={context.drawingMode != "erase" ? <BsPencil /> : <BsEraser  />}
        />
  
  </>)
}

const ColorOptionButton = ({ context }) => {
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
              style={{ position: 'absolute',height:'43px',width:'43px',top:360,left:50 + index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        className="static"
        shape={shapeForm}
        onClick={() => setShow(!show)}
        type={"danger"}
        icon={<IoColorPaletteOutline />}
      />
    </>
  );
};

const LineWidthPickerButton = ({ context }) => {
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
            top: 330,
            left: 55,
            cursor: "pointer",
          }}
        />
      ) }
      <FloatButton
        className="static"
        shape={shapeForm}
        type={"danger"}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </>
  );
};

const CurrentDrawToolPickerButtons = ({ context }) => {
  const tools = [
    { name: "rectangle", icon: <FaRegSquare /> }, 
    { name: "circle", icon: <FaRegCircle /> },
    { name: "straightLine ", icon: <LineOutlined /> },
     {name:'arrow', icon:<FaLongArrowAltRight/>}, 
    { name: "line", icon: <SignatureOutlined /> },
  ];
   return (
    <div className="flex gap-1 flex-col ">
       
          {tools.map((tool, index) => (
            <FloatButton
              className="static"
              shape={shapeForm}
              type={context.currentDrawTool === tool.name? "primary":"danger"}
              key={tool.name}
              onClick={() =>
                context.updateDrawTool(tool.name, emitToSocket)
              }
              icon={tool.icon}
            />
          ))}
  
    </div>
  );
};

const TextBotton = ({context}) =>{
  return (
    <>
      <FloatButton
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toogleTextMode(emitToSocket);
        }}
        type={context.drawingMode === "text" ? "primary" : "danger"}
        icon={<FontColorsOutlined />}
      />
    </>
  )
}

const DruggerButton = ({context})=>{

  return(
    <>
      <FloatButton
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toogleDrugMode(emitToSocket);
        }}
        type={context.drawingMode === "hand" ? "primary" : "danger"}
        icon={context.drawingMode === "hand"? <FaRegHandRock />:<FaRegHandPaper />}
      />
    </>
  )
}

