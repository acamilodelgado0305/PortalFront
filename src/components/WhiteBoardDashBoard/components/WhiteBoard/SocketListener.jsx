import { useEffect } from 'react'
import { events } from '../../../../enums/whiteboardEvents';

function SocketListener({context, socket}) {
  useEffect(()=>{
    if(socket) {
        socket.on(events.CHANGE_COLOR, (payload)=>{context.changeColor(payload)})
        socket.on(events.MOUSE_DOWN, (payload)=>{ context.handleMouseDown(payload)})
        socket.on(events.MOUSE_MOVE_DRAW,(payload) =>context.handleMouseMoveDraw(payload))
        socket.on(events.MOUSE_MOVE_ERASE, (payload) =>context.erase(payload))
        socket.on(events.TOGGLE_DRAWING_MODE,context.toggleDrawingMode)
        socket.on(events.MOUSE_UP,context.handleMouseUp)
        socket.on(events.CHANGE_LINE_WIDTH, (payload)=>context.updateLineWidth(payload))
        socket.on(events.CHANGE_CURRENT_DRAW_TOOL, (payload)=> context.updateDrawTool(payload));
        socket.on(events.TOOGLE_TEXT_MODE, context.toogleTextMode);
        socket.on(events.TEXT_POSITION_INITIALIZED,(payload)=> context.setTextPosition(payload))
        socket.on(events.CURRENT_TEXT_UPDATED, (payload)=>context.updateCurrentText(payload))
        socket.on(events.TEXT_ADDED, context.addTextToList);
        socket.on(events.TOOGLE_DRUG_MODE, context.toogleDrugMode);
      }


  },[context,socket])
  
    return (
    null
  )
}

export default SocketListener