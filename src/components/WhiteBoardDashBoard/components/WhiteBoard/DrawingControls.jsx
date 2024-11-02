import { useState } from "react";
import { FaPen, FaEraser, FaCircle  } from "react-icons/fa";
import { FloatButton } from 'antd';

function DrawingControls({ drawingMode, toggleDrawingMode, changeColor,currentColor }) {


  return (
    <> 
   <ColorOption changeColor={changeColor} currentColor={currentColor}/>
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


const ColorOption = ({changeColor, currentColor}) => {
    const [paletColorOpened, setPaletColorOpened ] = useState(false)

    return(
<>
      {paletColorOpened && (
    <>
       <FloatButton
      onClick={() => changeColor('red')}
      style={{ bottom: 150, right: 220 }}
      icon={<FaCircle color="red" />} 
    />
    <FloatButton
      onClick={() => changeColor('blue')}
      style={{ bottom: 150, right: 170 }}
      icon={<FaCircle color="blue" />} 
    />
    <FloatButton
      onClick={() => changeColor('green')}
      style={{ bottom: 150, right: 120 }}
      icon={<FaCircle color="green" />} 
    />
    <FloatButton
      onClick={() => changeColor('yellow')}
      style={{ bottom: 150, right: 70 }}
      icon={<FaCircle color="yellow" />} 
    />
  </>
  
       )}
             {/* quiero que este icono */}
             <FloatButton
              onClick={()=>{setPaletColorOpened(!paletColorOpened) }}
              type={ "danger"}
              style={{ bottom: 150}}
              icon={<FaCircle color={currentColor} /> }
             />
</>
    );
}