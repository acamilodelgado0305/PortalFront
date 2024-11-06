import { useState } from "react";
import {
  FaPen,
  FaEraser,
  FaCircle,
  FaRegSquare,
  FaRegCircle,
  FaLongArrowAltRight,
  FaRegHandPaper 
} from "react-icons/fa";
import { FloatButton } from "antd";
import {
  HighlightOutlined,
  SignatureOutlined,
  LineOutlined,
  FontColorsOutlined 
} from "@ant-design/icons";

const emitToSocket = true;

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
        style={{ bottom: 150 }}
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
              style={{ bottom: 200, right: 220 - index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        onClick={() => setShow(!show)}
        type={"danger"}
        style={{ bottom: 200 }}
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
            right: 0,
            zIndex: 9,
            cursor: "pointer",
          }}
        />
      )}
      <FloatButton
        type={"danger"}
        style={{ bottom: 250 }}
        icon={<HighlightOutlined />}
        onClick={() => setShow(!show)}
      />
    </div>
  );
};

const CurrentDrawToolPicker = ({ context }) => {
  const [show, setShow] = useState(false);
  const tools = [
    { name: "rectangle", icon: <FaRegSquare /> },
    { name: "circle", icon: <FaRegCircle /> },
    { name: "straightLine ", icon: <LineOutlined /> },
     {name:'arrow', icon:<FaLongArrowAltRight/>},
    { name: "line", icon: <SignatureOutlined /> },
  ];
 
  const currentTool = tools.find(
    (tool) => tool.name === context.currentDrawTool,
  );

  return (
    <div>
      {show && (
        <>
          {tools.map((tool, index) => (
            <FloatButton
              key={tool.name}
              onClick={() =>
                context.changeCurrentDrawTool(tool.name, emitToSocket)
              }
              style={{ bottom: 300, right: 270 - index * 50 }}
              icon={tool.icon}
            />
          ))}
        </>
      )}
      <FloatButton
        type="danger"
        style={{ bottom: 300 }}
        icon={currentTool && currentTool.icon}
        onClick={() => setShow(!show)}
      />
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
        style={{ bottom: 350 }}
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
        icon={<FaRegHandPaper />}
        style={{ bottom: 400 }}
      />
    </div>
  )
}

