import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { events } from "../../enums/whiteboardEvents.js";

// components
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx";
import WhiteBoard from "./components/WhiteBoard/Index.jsx";
import  WhiteBoardProvider  from "./components/WhiteBoard/WhiteBoardContext.jsx";

import { useWhiteBoardSocket } from "./WhiteBoardSocketProvider";
import "./animations.css";
import WhiteBoardListener from "./components/Socket/WhiteBoardListener.jsx";
import { uploadFile } from "../../services/utils.js";


function WhiteBoardDashBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false);
  const { room } = useParams();
  const whiteBoardSocket = useWhiteBoardSocket();

  const fileInputRef = useRef(null);

  const handleFloatButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      event.target.value = null;
      const data = await uploadFile(file, file.type);
      if (whiteBoardSocket) {
        whiteBoardSocket.emit(events.AUDIOFILE_OPENED, {
          name: file.name,
          url: data.url,
          room: room,
        });
      }
    }
  };
  const handleCloseAudioPlayer = () => {
    setAudioContent(false);
    setAudioFile(null);
  };
  const listenerAudioFileOpened = (file) => {
    if (file) {
      setAudioFile(file);
      setAudioContent(true);
    }
  };



  return (
    <WhiteBoardProvider>
      <WhiteBoardListener
        socket={whiteBoardSocket}
        listenerAudioFileOpened={listenerAudioFileOpened}
        room={room}
      />
      <Header />
      <div className="fixed flex h-full w-full justify-center bg-[#7066e0]">
        <FloatButton
          icon={<PlayCircleOutlined className="iconAudioFloat" />}
          onClick={handleFloatButtonClick}
          className="floatButtonAudio iconAudioFloat"
        />

        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="relative top-[0.5rem] h-[91%] w-[90%] bg-white">
              <WhiteBoard socket={whiteBoardSocket}/>
                <AudioPlayer
              audioContent={audioContent}
              setAudioContent={setAudioContent}
              file={audioFile}
              handleCloseAudioPlayer={handleCloseAudioPlayer}
            />
        </div>
      </div>
    </WhiteBoardProvider>
  );
}

export default WhiteBoardDashBoard;
