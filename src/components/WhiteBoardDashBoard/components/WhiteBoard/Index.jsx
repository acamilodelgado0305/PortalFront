import { useContext } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor, textCursor } from './utils/cursorIcons.js';
import { WhiteBoardContext } from './WhiteBoardContext.jsx';
import SocketListener  from "./SocketListener.jsx"
import { useWhiteBoardSocket } from '../../WhiteBoardSocketProvider.jsx';


function WhiteBoard({}) {
  const context = useContext(WhiteBoardContext); 
  const socket = useWhiteBoardSocket();

  // si el  context.drawingMode === 'draw' && pencilCursor
  // si es  context.drawingMode === 'erase ' && eraserCursor
  // si es  context.drawingMode === 'text && textCursor
  return (
<div
  style={{
    cursor:
      context.drawingMode === 'draw' ? pencilCursor :
      context.drawingMode === 'erase' ? eraserCursor :
      context.drawingMode === 'text' ? textCursor :
      'default', // Default cursor if none of the modes match
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
