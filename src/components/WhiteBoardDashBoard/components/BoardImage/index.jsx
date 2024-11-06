import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { FullscreenOutlined, CloseOutlined } from "@ant-design/icons";
import { events } from "../../../../enums/whiteboardEvents";

function BoardImage({ url, room, onClose, socket, context }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  console.log(context.drawingMode != 'hand')
  useEffect(()=>{},[socket])
  useEffect(() => {
    if(!socket){  
      console.log('No hay socket')
      return } else{
        console.log('hay socket')
      }
    socket.on(events.MOVE_IMAGE, (data) => {
      console.log(JSON.stringify(data))
      console.log('Data position '+data.position)
     setPosition(data.position);
    });
 
  }, [socket]); 

  const handleDragStop = (e, d) => {
    console.log('moviendo pero no soy socket   y:'+d.y + 'x:'+d.x)
    setPosition({ x: d.x, y: d.y });
    if(!socket) return
      socket.emit(events.MOVE_IMAGE, { room, position: { x: d.x, y: d.y } });
  };

  return (
    <>
    <Rnd
      position={position}
      onDragStop={handleDragStop}
      dragHandleClassName={"drag-image-handle"}
      enableResizing={true}
    >
      {url && (
        <div style={{ width: "auto", height: "auto", position: "relative" }}>
          <CloseOutlined
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              color: "white",
            }}
            onClick={onClose}
          />
          <img
            className={(context?.drawingMode === 'hand') && "drag-image-handle"}
            src={url}
            alt="Whiteboard"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 5,
            }}
          />
        </div>
      )}
    </Rnd>
    </>
  );
}

export default BoardImage;