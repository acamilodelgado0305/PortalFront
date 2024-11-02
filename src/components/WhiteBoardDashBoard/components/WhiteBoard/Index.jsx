import { useContext } from 'react';
import DrawingControls from './DrawingControls';
import DrawingCanvas from './DrawingCanvas';
import { pencilCursor, eraserCursor } from './utils/cursorIcons.js';
import { WhiteBoardContext } from './WhiteBoardContext.jsx';

function WhiteBoard() {
  const context = useContext(WhiteBoardContext); 


  return (
    <div
      style={{
        cursor: context.drawingMode === 'draw' ? pencilCursor : eraserCursor,
      }}
    >
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
