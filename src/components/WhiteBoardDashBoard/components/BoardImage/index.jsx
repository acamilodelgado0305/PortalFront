import React from "react";
import { Rnd } from "react-rnd";
import { FullscreenOutlined, CloseOutlined  } from "@ant-design/icons";

function BoardImage({ url, onClose }) {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
      }}
      dragHandleClassName={"drag-image-handle"}
      enableResizing={true}
    >
      {url && (
        <div style={{ width: "auto", height: "auto", position: "relative" }}>
          <CloseOutlined style={{position:'absolute', rigth:'0',top:'0', color:'white'}} onClick={onClose}/>
          <img
            className="drag-image-handle"
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
  );
}

export default BoardImage;
