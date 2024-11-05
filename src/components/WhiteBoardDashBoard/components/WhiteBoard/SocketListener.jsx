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
        socket.on(events.MOUSE_UP,() =>  context.handleMouseUp)
        socket.on(events.CHANGE_LINE_WIDTH, (payload)=>context.changeLineWidth(payload))
    }

// falta cerrar los linsteners

  },[context,socket])
  
    return (
    null
  )
}

export default SocketListener