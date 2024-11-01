import { useEffect } from "react";
import { events } from "../../../../enums/whiteboardEvents.js";

function WhiteBoardListener({ socket, listenerAudioFileOpened, room }) {
  useEffect(() => {
    if (socket) {
      // Escuchar conexión
      socket.on(events.CONNECTION, (data) => { console.log(data);});
      socket.on(events.AUDIOFILE_OPENED, (file) => listenerAudioFileOpened(file));
      // Unirse a la sala
      socket.emit(events.CONNECTION)
      socket.emit(events.JOIN_ROOM, room);

      return () => {
        socket.off(events.CONNECTION);
        socket.off(events.AUDIOFILE_OPENED);
        socket.off(events.JOIN_ROOM);
      };
    }
  }, [socket, room]);

  return null;
}

export default WhiteBoardListener;
