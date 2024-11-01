import { useEffect } from "react";
import { events } from "../../../../enums/whiteboardEvents.js";


function WhiteBoardListener({socket, listenerAudioFileOpened, room}) {
useEffect(() => {
  if (socket) {   
    socket.on(events.CONNECTION , (data) => {
      console.log(data);
    });
    socket.emit(events.JOIN_ROOM ,room)
 
    socket.on(events.AUDIOFILE_OPENED, (file) => {
      listenerAudioFileOpened(file)
    });

    return () => {
      socket.off(events.CONNECTION);
    };
  }
}, [socket]);
  return (
   null
  )
}

export default WhiteBoardListener