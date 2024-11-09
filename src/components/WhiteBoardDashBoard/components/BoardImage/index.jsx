import  { useState } from "react";
import { Rnd } from "react-rnd";
import {  CloseOutlined } from "@ant-design/icons";

function BoardImage({ url, room, onClose, context }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });


  const handleDragStop = (e, d) => {
    setPosition({ x: d.x, y: d.y });
    
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
        <div style={{ width: "auto", height: "auto", position: "relative", marginLeft:52 }}>
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