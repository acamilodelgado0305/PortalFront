import { useContext } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor } from './utils/cursorIcons.js';
import { WhiteBoardContext } from './WhiteBoardContext.jsx';
import SocketListener  from "./SocketListener.jsx"


function WhiteBoard({socket}) {
  const context = useContext(WhiteBoardContext); 

  return (
    <div
      style={{
        cursor: context.drawingMode === 'draw' ? pencilCursor : eraserCursor,
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
