import { useState } from "react";
import { FaPen, FaEraser, FaCircle } from "react-icons/fa";
import { FloatButton } from "antd";
import { HighlightOutlined } from "@ant-design/icons";

function DrawingControls({ context }) {
  const emitToSocket = true;
  return (
    <>
      <LineWidthPicker context={context} />
      <ColorOption
        changeColor={context.changeColor}
        currentColor={context.currentColor}
      />
      <FloatButton
        onClick={() => {
          context.toggleDrawingMode(emitToSocket);
        }}
        type={context.drawingMode === "draw" ? "primary" : "danger"}
        icon={context.drawingMode === "draw" ? <FaPen /> : <FaEraser />}
        style={{ bottom: 100 }}
      />
    </>
  );
}

export default DrawingControls;

const ColorOption = ({ changeColor, currentColor }) => {
  const [paletColorOpened, setPaletColorOpened] = useState(false);
  const colors = ["red", "blue", "green", "yellow"];
  const emitToSocket = true;

  return (
    <>
      {paletColorOpened && (
        <>
          {colors.map((color, index) => (
            <FloatButton
              key={color}
              onClick={() => changeColor(color, emitToSocket)}
              style={{ bottom: 150, right: 220 - index * 50 }}
              icon={<FaCircle color={color} />}
            />
          ))}
        </>
      )}
      <FloatButton
        onClick={() => setPaletColorOpened(!paletColorOpened)}
        type={"danger"}
        style={{ bottom: 150 }}
        icon={<FaCircle color={currentColor} />}
      />
    </>
  );
};

const LineWidthPicker = ({ context }) => {
  const [show, setShow] =useState(false)
  return (
    <div>
      {show &&
      <input
        type="range"
        id="lineWidth"
        min="1"
        max="20"
        value={context?.lineWidth || 2}
        onChange={(e) => context.changeLineWidth(Number(e.target.value))} 
        style={{
          position: 'absolute', 
          bottom: 205,
          right:0,
          zIndex:9, 
          cursor:'pointer'          

        }}
      /> }
      <FloatButton
        type={"danger"}
        style={{ bottom: 200 }}
        icon={<HighlightOutlined />}
        onClick={()=> setShow(!show)}
      />
    </div>
  );
};
