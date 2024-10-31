import { useEffect } from "react";

function WhiteBoardListener({socket, listenerAudioFileOpened}) {
useEffect(() => {
  if (socket) {
    socket.on('connection', (data) => {
      console.log(data);
    });
    socket.on('audioFileOpened', (file) => {
      listenerAudioFileOpened(file)
    });
    socket.emit('draw', { x: 10, y: 20 });

    return () => {
      socket.off('connection');
    };
  }
}, [socket]);
  return (
   null
  )
}

export default WhiteBoardListener