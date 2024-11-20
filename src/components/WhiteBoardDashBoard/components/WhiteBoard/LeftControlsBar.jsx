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
import { BiMinus } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
// GLOBAL
const emitToSocket = true;
const shapeForm =  "square"||"circle";
import sizeIcon from  './utils/size-icon.svg' 

const style =   {display: 'flex',
alignItems: 'center',
justifyContent: 'center',
width: '50px',
height: '50px',
cursor: 'pointer',
borderRadius:'15px'
}

function LeftControlsBar({ context }) {


  return (
    <div className="flex gap-1 flex-col py-2 pr-2 absolute h-full bg-[#FFFFFF] z-[99]">
      <PencilEraserToggleButton  context={context} />
      <TextBotton  context={context} />
      <LineWidthPickerButton context={context} />
      <ColorOptionButton context={context} />
      <UndoRedoButtons context={context} />
      <CurrentDrawToolPickerButtons context={context} />
      <TrashBinClearerButton context={context}/>
      <ZoomButton context={context}/>
       <DruggerButton context={context} />
    </div>
  );
}
export default LeftControlsBar;






const TrashBinClearerButton = ({ context }) => {
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
const UndoRedoButtons = ({ context }) => (
  <>
    {/* Botón para deshacer */}
    <div
      className="static"
      style={style}
      shape={shapeForm}
      onClick={() => context.undo(emitToSocket)} 
    > <IoReturnUpBack size={25} /></div>
    {/* Botón para rehacer */}
    <div
      className="static"
      style={style}
      shape={shapeForm}
      onClick={() => context.redo(emitToSocket)} 
    > <IoReturnUpForward  size={25}/></div>
  </>
);



const ZoomButton = ({ context }) => {

  return (
    <div
      className="static"
      style={{
        ...style, 
        background: (context.drawingMode === "zoom") ? '#1677ff' : '',
        color: (context.drawingMode === "zoom") ? 'white' : '',
      }}
      shape={shapeForm}
      onClick={context.toggleZoomMode}
    >
{context.zoomType == 'in' ? <BsZoomIn size={30}/> : <BsZoomOut size={30}/>}
    </div>
  );
};


const PencilEraserToggleButton = ({context}) =>{
  return (<>
   <div
       className="static"
       shape={shapeForm}
       onClick={() => { context.toggleDrawingMode(emitToSocket, "draw"); 
                        context.updateDrawTool("line", emitToSocket);
        }}
        style={{
          ...style, 
          background: (context.drawingMode === "draw" && context.currentDrawTool === "line") ? '#1677ff' : '',
          color: (context.drawingMode === "draw" && context.currentDrawTool === "line") ? 'white' : '',
        }}
        >
        <BsPencil  size={30} />
        </div>
           <div
       className="static"
       shape={shapeForm}
       onClick={() => { context.toggleDrawingMode(emitToSocket, "erase"); 
        }}
        style={{
          ...style, 
          background: (context.drawingMode === "erase") ? '#1677ff' : '',
          color: (context.drawingMode === "erase" ) ? 'white' : '',
        }}
        > <BsEraser size={30}  /></div>
  
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
              style={{ position: 'absolute', height:'43px',width:'43px',left:50 + index * 50, top:225 }}
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
            top: 189,
            left: 55,
            cursor: "pointer",
          }}
        />
      ) }
      <div
        className="static"
        shape={shapeForm}
        type={"danger"}
        onClick={() => setShow(!show)}
        style={style}
      ><img src={sizeIcon} alt="Size Icon" style={{ width: "30px", height: "30px" }} /></div>
    </>
  );
};

const CurrentDrawToolPickerButtons = ({ context }) => {
  const tools = [
    { name: "rectangle", icon: <FaRegSquare  size={30} /> }, 
    { name: "circle", icon: <FaRegCircle  size={30} /> },
    { name: "straightLine", icon: <BiMinus  size={30} /> },
     {name:'arrow', icon:<FaLongArrowAltRight  size={30} style={{height:"40%", width:'120%'}} />},
  ];
   return (
    <div className="flex gap-1 flex-col ">
       
          {tools.map((tool, index) => (
            <div
              className="static"
              shape={shapeForm}
              style={{
                ...style, 
                background: (context.currentDrawTool === tool.name  && context.drawingMode === "draw" )? '#1677ff' : '',
                color: (context.currentDrawTool === tool.name  && context.drawingMode === "draw" ) ? 'white' : '',
              }}
              key={tool.name}
              onClick={() =>
                context.updateDrawTool(tool.name, emitToSocket)
              }
              icon={tool.icon}
            > {tool.icon}</div>
          ))}
  
    </div>
  );
};

const TextBotton = ({context}) =>{
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
          background: (context.drawingMode === "text") ? '#1677ff' : '',
          color: (context.drawingMode === "text") ? 'white' : '',
        }}
      >
      <FontColorsOutlined style={{fontSize:'30px'}} />
      </div>
    </>
  )
}

const DruggerButton = ({context})=>{

  return(
    <>
      <div
        className="static"
        shape={shapeForm}
        onClick={() => {
          context.toogleDrugMode(emitToSocket);
        }}
        style={{
          ...style, 
          background: (context.drawingMode === "hand") ? '#1677ff' : '',
          color: (context.drawingMode === "hand") ? 'white' : '',
        }}
      >
        {context.drawingMode === "hand"? <FaRegHandRock  size={30}  />:<FaRegHandPaper  size={30}  />}
      </div>
    </>
  )
}

