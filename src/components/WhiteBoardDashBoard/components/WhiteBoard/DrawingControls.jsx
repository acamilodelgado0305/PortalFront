import { useState } from "react";
import { FaPen, FaEraser, FaCircle  } from "react-icons/fa";
import { FloatButton } from 'antd';

function DrawingControls({context}) {
  return (
    <> 
      <ColorOption changeColor={context.changeColor} currentColor={context.currentColor}/>
      <FloatButton
        onClick={context.toggleDrawingMode}
        type={context.drawingMode === 'draw' ? "primary" : "danger"}
        icon={context.drawingMode === 'draw' ? <FaPen /> : <FaEraser />}
        style={{ bottom: 100}}
      />
    </>
  );
}

export default DrawingControls;


const ColorOption = ({ changeColor, currentColor }) => {
  const [paletColorOpened, setPaletColorOpened] = useState(false);
  const colors = ['red', 'blue', 'green', 'yellow']; 

  return (
    <>
      {paletColorOpened && (
        <>
          {colors.map((color, index) => (
            <FloatButton
              key={color} 
              onClick={() => changeColor(color)}
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
