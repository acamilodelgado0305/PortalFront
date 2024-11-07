import LeftControlsBar from './LeftControlsBar';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor, textCursor } from './utils/cursorIcons.js';
import SocketListener  from "./SocketListener.jsx"

function WhiteBoard({socket, context}) {
  
  
  return (
<div
  style={{
    cursor:
      context.drawingMode === 'draw' ? pencilCursor :
      context.drawingMode === 'hand' ? 'grab' :
      context.drawingMode === 'erase' ? eraserCursor :
      context.drawingMode === 'text' && textCursor 
      
  }}
>

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
