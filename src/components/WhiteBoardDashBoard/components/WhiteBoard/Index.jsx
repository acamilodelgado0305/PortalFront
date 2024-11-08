import LeftControlsBar from './LeftControlsBar';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor, textCursor } from './utils/cursorIcons.js';
import SocketListener  from "./SocketListener.jsx"
import { Button } from 'antd';

function WhiteBoard({socket, context}) {
  
  
  return (
<div
  style={{
    cursor:
      context.drawingMode === 'draw' ? pencilCursor :
      context.drawingMode === 'hand' ? 'grab' :
      context.drawingMode === 'erase' ? eraserCursor :
      context.drawingMode === 'text' && textCursor 
      
  , width:'100%',
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
      <DrawingCanvas
      context={context}
      />
  
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



