import { EditOutlined, ClearOutlined } from '@ant-design/icons'; 
import { Button } from 'antd';

function DrawingControls({ drawingMode, toggleDrawingMode }) {

  return (
    <div>
        <Button onClick={toggleDrawingMode} type={drawingMode === 'draw' ? "primary" : "danger"} icon={drawingMode === 'draw' ? <EditOutlined /> : <ClearOutlined />}>
          {drawingMode === 'draw' ? 'Lápiz' : 'Goma'}
        </Button>
      </div>
  );
}

export default DrawingControls;
