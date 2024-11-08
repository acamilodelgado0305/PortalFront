import LeftControlsBar from './LeftControlsBar';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor, textCursor, zoomInCursor, zoomOutCursor } from './utils/cursorIcons.js';
import SocketListener  from "./SocketListener.jsx"
import { Button } from 'antd';
import { Rnd } from "react-rnd";
function WhiteBoard({socket, context}) {
  
  
  return (
<div
  style={{
   width:'100%',
  height:'100%'
}}
  
>
      <BoardHeader
        context={context}
        socket={socket}
      />
      <SocketListener
       context={context}
       socket={socket}
      />
      <LeftControlsBar
       context={context}
      />
     
      <Rnd
        default={{
          x: 0,
          y: 0
        }}
        dragHandleClassName={"drag-whiteboard-handle"}
        style={{  cursor:
          context.drawingMode === 'draw' ? pencilCursor :
          context.drawingMode === 'hand' ? (context.isgrabbing ? 'grabbing' :'grab') :
          context.drawingMode === 'erase' ? eraserCursor :
          context.drawingMode === 'zoom' ? (context.zoomType == 'in' ? zoomInCursor : zoomOutCursor):
          context.drawingMode === 'text' && textCursor 
          
        }}
      >
        <DrawingCanvas context={context} />
      </Rnd>
     {/** */}
    </div>
  );
}

export default WhiteBoard;



;
function BoardHeader({ context, socket }) {
  return (
    <div className="absolute w-full pl-[59px]">    <Button className="z-[99]" color="default" variant="filled">
 Página {context.currentPage}
  </Button></div>
  );
}



