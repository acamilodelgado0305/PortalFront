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

function DrawingControls({ context }) {

  return (
    <>
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
        style={{ top: 470, left:LeftPosition }}
      />
      <FloatButton
      icon={<RiDeleteBin6Line/>}
      style={{top: 512, left:LeftPosition}}
      />
        <FloatButton
      icon={true ? <BsZoomIn/> :<BsZoomOut /> }
      style={{top: 554, left:LeftPosition}}
      />
  {/** IoReturnUpForward */}
      <FloatButton
      icon={<IoReturnUpBack/>  }
      style={{ top: 596,left: LeftPosition}}
      />
       <FloatButton
      icon={<IoReturnUpForward/>  }
      style={{  top:638, left: LeftPosition}}
      />
    </>
  );
}
// 470  554 596 596+42= 638
export default DrawingControls;

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
              style={{ top: 428, left: 300 - index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        onClick={() => setShow(!show)}
        type={"danger"}
        style={{ top: 428, left:LeftPosition }}
        icon={<IoColorPaletteOutline />}
      />
    </>
  );
};
// 386 + 42 428 

const LineWidthPicker = ({ context }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div>
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
            top: 386,
            left: 55,
            zIndex: 9,
            cursor: "pointer",
          }}
        />
      )}
      <FloatButton
        type={"danger"}
        style={{ top: 386, left:LeftPosition }}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </div>
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
    <div>
        <>
          {tools.map((tool, index) => (
            <FloatButton
              type={context.currentDrawTool === tool.name? "primary":"danger"}
              key={tool.name}
              onClick={() =>
                context.changeCurrentDrawTool(tool.name, emitToSocket)
              }
              style={{ top: 184 + index * 42, left:LeftPosition }}
              icon={tool.icon}
            />
          ))}
        </>
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
        style={{ top: 142, left:LeftPosition }}
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
        style={{ top: 100, left:LeftPosition }}
      />
    </div>
  )
}

