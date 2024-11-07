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
const LeftPosition = 100;

function LeftControlsBar({ context }) {

  return (
    <div className="flex gap-1 flex-col py-2 pl-2 absolute">
        <DruggerButton context={context} /> 
      <TextBotton  context={context} />
    
     
      <CurrentDrawToolPicker context={context} />
      <LineWidthPicker context={context} />
      <ColorOption
        changeColor={context.changeColor}
        currentColor={context.currentColor}
      />

      <FloatButton
        onClick={() => {
          context.toggleDrawingMode(emitToSocket);
        }}
        type={context.drawingMode != "erase" ? "primary" : "danger"}
        icon={context.drawingMode != "erase" ? <BsPencil /> : <BsEraser  />}
        style={{ position: 'static' }}
      />

      <FloatButton
      icon={<RiDeleteBin6Line/>}
      style={{ position: 'static' }}
      />
        <FloatButton
      icon={true ? <BsZoomIn/> :<BsZoomOut /> }
      style={{ position: 'static' }}
      />
      <FloatButton
      icon={<IoReturnUpBack/>  }
      style={{ position: 'static' }}
      />
       <FloatButton
      icon={<IoReturnUpForward/>  }
      style={{ position: 'static' }}
      /> 
    </div>
  );
}
// 470  554 596 596+42= 638
export default LeftControlsBar;

const ColorOption = ({ changeColor, currentColor }) => {
  const [show, setShow] = useState(false);
  const colors = ["red", "blue", "green", "yellow"];
 

  return (
    <>
      {show && (
        <>
          {colors.map((color, index) => (
            <FloatButton
              key={color}
              onClick={() => changeColor(color, emitToSocket)}
              style={{ position: 'absolute',top:360,left:50 + index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        onClick={() => setShow(!show)}
        type={"danger"}
        style={{ position: 'static' }}
        icon={<IoColorPaletteOutline />}
      />
    </>
  );
};
// 386 + 42 428 

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
        type={"danger"}
        style={{ position: 'static' }}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </>
  );
};

const CurrentDrawToolPicker = ({ context }) => {
  const tools = [
    { name: "rectangle", icon: <FaRegSquare /> }, //184
    { name: "circle", icon: <FaRegCircle /> }, // 226
    { name: "straightLine ", icon: <LineOutlined /> }, // 268
     {name:'arrow', icon:<FaLongArrowAltRight/>}, // 302
    { name: "line", icon: <SignatureOutlined /> }, // 344
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
    <div>
      <FloatButton
        onClick={() => {
          context.toogleTextMode(emitToSocket);
        }}
        type={context.drawingMode === "text" ? "primary" : "danger"}
        icon={<FontColorsOutlined />}
        style={{ position: 'static' }}
      />
    </div>
  )
}

const DruggerButton = ({context})=>{

  return(
    <div>
      <FloatButton
        onClick={() => {
          context.toogleDrugMode(emitToSocket);
        }}
        type={context.drawingMode === "hand" ? "primary" : "danger"}
        icon={context.drawingMode === "hand"? <FaRegHandRock />:<FaRegHandPaper />}
        style={{ position: 'static' }}
      />
    </div>
  )
}

