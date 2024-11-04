import { useEffect } from 'react'

function SocketListener({context, socket}) {
  useEffect(()=>{
    if(socket) {
        socket.on('changeColor', (newColor)=>{context.changeColor(newColor)})
        socket.on('mouseDown', (position)=>{ context.handleMouseDown(position)})
        socket.on('mouseMoveDraw',(position) =>context.handleMouseMoveDraw(position))
        socket.on('mouseMoveErase', (position) =>context.erase(position))
        socket.on('toggleDrawingMode',context.toggleDrawingMode)
        socket.on('mouseUp', context.handleMouseUp)
    }



  },[context,socket])
  
    return (
    null
  )
}

export default SocketListener