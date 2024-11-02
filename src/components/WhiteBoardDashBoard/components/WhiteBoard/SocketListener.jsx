import { useEffect } from 'react'

function SocketListener({context, socket}) {
  useEffect(()=>{
    if(socket) {
        socket.on('changeColor', (newColor)=>{
            context.changeColor(newColor) 
        })
        socket.on('mouseDown', (position)=>{
            context.handleMouseDown(position) 
        // Falta ver la posición cuando se emite el evento y 
        // modificar la función  { x: pos.x, y: pos.y }
        })
        /* Falta la funcion handleMouseMove  que debe dividirse en dos */

        socket.on('mouseUp', context.handleMouseUp)
        socket.on('toggleDrawingMode',context.toggleDrawingMode)

    }



  },[context,socket])
  
    return (
    null
  )
}

export default SocketListener