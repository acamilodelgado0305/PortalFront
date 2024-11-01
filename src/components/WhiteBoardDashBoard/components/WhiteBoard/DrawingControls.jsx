import { FaPen, FaEraser, FaCircle  } from "react-icons/fa";
import { FloatButton } from 'antd';

function DrawingControls({ drawingMode, toggleDrawingMode, changeColor }) {
  return (
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
       />

       {/* quiero que este icono */}
       <FloatButton
        style={{ bottom: 150}}
        icon={<FaCircle/> }
       />
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
