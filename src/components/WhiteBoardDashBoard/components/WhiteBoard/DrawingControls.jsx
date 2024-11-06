import { useState } from "react";
import {
  FaPen,
  FaEraser,
  FaCircle,
  FaRegSquare,
  FaRegCircle,
  FaLongArrowAltRight,
  FaRegHandPaper, 
  FaRegHandRock
} from "react-icons/fa";
import { FloatButton } from "antd";
import {
  HighlightOutlined,
  SignatureOutlined,
  LineOutlined,
  FontColorsOutlined 
} from "@ant-design/icons";

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
        icon={context.drawingMode != "erase" ? <FaPen /> : <FaEraser />}
        style={{ bottom: 150, left:LeftPosition }}
      />
    </>
  );
}

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
              style={{ bottom: 200, left: 300 - index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        onClick={() => setShow(!show)}
        type={"danger"}
        style={{ bottom: 200, left:LeftPosition }}
        icon={<FaCircle color={currentColor} />}
      />
    </>
  );
};

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
            bottom: 255,
            left: 0,
            zIndex: 9,
            cursor: "pointer",
          }}
        />
      )}
      <FloatButton
        type={"danger"}
        style={{ bottom: 250, left:LeftPosition }}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </div>
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
    <div>
        <>
          {tools.map((tool, index) => (
            <FloatButton
              type={context.currentDrawTool === tool.name? "primary":"danger"}
              key={tool.name}
              onClick={() =>
                context.changeCurrentDrawTool(tool.name, emitToSocket)
              }
              style={{ bottom: 300 + index * 50, left:LeftPosition }}
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
        style={{ bottom: 550, left:LeftPosition }}
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
        style={{ bottom: 600, left:LeftPosition }}
      />
    </div>
  )
}

