import { FaPen, FaEraser } from "react-icons/fa";
import { FloatButton } from 'antd';

function DrawingControls({ drawingMode, toggleDrawingMode }) {
  return (
    <>
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
