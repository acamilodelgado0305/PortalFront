import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext.jsx';
import { pencilCursor, eraserCursor, textCursor, zoomInCursor, zoomOutCursor } from './utils/cursorIcons.js';
import { Button, notification } from 'antd';
import { Rnd } from "react-rnd";
import LeftControlsBar from './LeftControlsBar';
import DrawingCanvas from './DrawingCanvas';
import SocketListener from "./SocketListener.jsx";


function WhiteBoard({ socket, context }) {
  const { room } = useParams();
  const { user } = useAuth();
  const [messageShown, setMessageShown] = useState(false);

  useEffect(() => {
    if (user.id === room && !messageShown) {
      notification.warning({
        message: 'Advertencia',
        description: 'Esta pizarra es de prueba no de clase. La pizarra de clase, se habilita 15 minutos antes de la clase',
        duration: 6,
      });
      setMessageShown(true); 
    }
  }, [user.id, room, messageShown]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BoardHeader context={context} />
      <SocketListener context={context} socket={socket} />
      <LeftControlsBar context={context} />
     
      <Rnd
        default={{
          x: 0,
          y: 0
        }}
        dragHandleClassName={"drag-whiteboard-handle"}
        style={{
          cursor: context.drawingMode === 'draw' && context.currentDrawTool === "line" ? pencilCursor :
                  context.drawingMode === 'hand' ? (context.isgrabbing ? 'grabbing' : 'grab') :
                  context.drawingMode === 'erase' ? eraserCursor :
                  context.drawingMode === 'zoom' ? (context.zoomType === 'in' ? zoomInCursor : zoomOutCursor) :
                  context.drawingMode === 'text' && textCursor
        }}
      >
        <DrawingCanvas context={context} />
      </Rnd>
    </div>
  );
}

export default WhiteBoard;

function BoardHeader({ context, socket }) {
  return (
    <div className="absolute w-full pl-[59px]">
      <Button className="z-[99]" color="default" variant="filled">
        Página {context.currentPage}
      </Button>
    </div>
  );
}

