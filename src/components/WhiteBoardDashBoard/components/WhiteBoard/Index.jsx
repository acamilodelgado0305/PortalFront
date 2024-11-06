import { useContext } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor, textCursor } from './utils/cursorIcons.js';
import { WhiteBoardContext } from './WhiteBoardContext.jsx';
import SocketListener  from "./SocketListener.jsx"

function WhiteBoard({socket, context}) {
  
  
  return (
<div
  style={{
    cursor:
      context.drawingMode === 'draw' ? pencilCursor :
      context.drawingMode === 'erase' ? eraserCursor :
      context.drawingMode === 'text' && textCursor 
      
  }}
>

      <SocketListener
       context={context}
       socket={socket}
      />
      <DrawingControls
       context={context}
      />
      <DrawingCanvas
      context={context}
      />
  
    </div>
  );
}

export default WhiteBoard;
