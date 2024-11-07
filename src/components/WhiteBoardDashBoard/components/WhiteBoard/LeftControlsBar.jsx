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
const emitToSocket = true;

function LeftControlsBar({ context }) {

  return (
    <div className="flex gap-1 flex-col py-2 pl-2 absolute">
      <DruggerButton context={context} /> 
      <TextBotton  context={context} />
      <CurrentDrawToolPicker context={context} />
      <LineWidthPicker context={context} />
      <ColorOption context={context} />
      <PencilEraserToggleButton  context={context} />
     
    {/*  // boton de eliminar */}
      <FloatButton
      className="static"
       icon={<RiDeleteBin6Line/>}
      />
    {/*  // zoom de eliminar */}
      <FloatButton
       className="static"
       icon={true ? <BsZoomIn/> :<BsZoomOut /> }
       />

       
       {/* boton volver atras */}
      <FloatButton
      className="static"
      icon={<IoReturnUpBack/>  }
      />
      {/* boton adelante */}
       <FloatButton
       className="static"
       icon={<IoReturnUpForward/>  }
       /> 
    </div>
  );
}
// 470  554 596 596+42= 638
export default LeftControlsBar;

const PencilEraserToggleButton = ({context}) =>{
  return (<>
   <FloatButton
       className="static"  onClick={() => { context.toggleDrawingMode(emitToSocket); 
        }}
        type={context.drawingMode != "erase" ? "primary" : "danger"}
        icon={context.drawingMode != "erase" ? <BsPencil /> : <BsEraser  />}
        />
  
  </>)
}




const ColorOption = ({ context }) => {
  const [show, setShow] = useState(false);
  const colors = ["red", "blue", "green", "yellow"];
 

  return (
    <>
      {show && (
        <>
          {colors.map((color, index) => (
            <FloatButton
              key={color}
              onClick={() => context.changeColor(color, emitToSocket)}
              style={{ position: 'absolute',top:360,left:50 + index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        className="static"
        onClick={() => setShow(!show)}
        type={"danger"}
        icon={<IoColorPaletteOutline />}
      />
    </>
  );
};

const LineWidthPicker = ({ context }) => {
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
            context.changeLineWidth(Number(e.target.value), emitToSocket)
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
        type={"danger"}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </>
  );
};

const CurrentDrawToolPicker = ({ context }) => {
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
              type={context.currentDrawTool === tool.name? "primary":"danger"}
              key={tool.name}
              onClick={() =>
                context.changeCurrentDrawTool(tool.name, emitToSocket)
              }
              style={{ position: 'static' }}
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
        onClick={() => {
          context.toogleDrugMode(emitToSocket);
        }}
        type={context.drawingMode === "hand" ? "primary" : "danger"}
        icon={context.drawingMode === "hand"? <FaRegHandRock />:<FaRegHandPaper />}
      />
    </>
  )
}

