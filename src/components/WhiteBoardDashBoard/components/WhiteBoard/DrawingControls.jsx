import { useState } from "react";
import { FaPen, FaEraser, FaCircle  } from "react-icons/fa";
import { FloatButton } from 'antd';

function DrawingControls({ drawingMode, toggleDrawingMode, changeColor }) {


  return (
    <> 
   <ColorOption/>
      <FloatButton
        onClick={toggleDrawingMode}
        type={drawingMode === 'draw' ? "primary" : "danger"}
        icon={drawingMode === 'draw' ? <FaPen /> : <FaEraser />}
        style={{ bottom: 100}}
      />
    </>
  );
}

export default DrawingControls;


const ColorOption = () => {
    const [paletColorOpened, setPaletColorOpened ] = useState(false)

    return(
<>
      {paletColorOpened && (
        <>
        <FloatButton
              style={{ bottom: 150, right:170}}
              icon={<FaCircle/> }
             />
           <FloatButton
              style={{ bottom: 150, right:120}}
              icon={<FaCircle/> }
             />
              <FloatButton
              style={{ bottom: 150, right:70}}
              icon={<FaCircle/> }
             /></>
       )}
             {/* quiero que este icono */}
             <FloatButton
              onClick={()=>{setPaletColorOpened(!paletColorOpened) }}
              style={{ bottom: 150}}
              icon={<FaCircle/> }
             />
</>
    );
}