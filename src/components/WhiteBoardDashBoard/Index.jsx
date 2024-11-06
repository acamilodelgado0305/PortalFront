import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { events } from "../../enums/whiteboardEvents.js";

// components
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx";
import WhiteBoard from "./components/WhiteBoard/Index.jsx";
import { WhiteBoardContext } from "./components/WhiteBoard/WhiteBoardContext.jsx";

import { useWhiteBoardSocket } from "./WhiteBoardSocketProvider";
import "./animations.css";
import WhiteBoardListener from "./components/Socket/WhiteBoardListener.jsx";
import { uploadFile } from "../../services/utils.js";
import BoardImage from "./components/BoardImage/index.jsx";
import { TbMessage } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";

function WhiteBoardDashBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { room } = useParams();
  const whiteBoardSocket = useWhiteBoardSocket();
  const context = useContext(WhiteBoardContext);

  useEffect(() => {}, [whiteBoardSocket]);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFloatButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current.click();
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
          page: "1",
        });
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      event.target.value = null;
      const data = await uploadFile(file, file.type);
      if (whiteBoardSocket) {
        whiteBoardSocket.emit(events.IMAGE_BOARD, {
          name: file.name,
          url: data.url,
          room: room,
          page: "1",
        });
      }
      setImageUrl(data.url);
    }
  };

  const handleCloseAudioPlayer = () => {
    setAudioContent(false);
    setAudioFile(null);
  };

  const handleCloseImage = () => {
    setImageUrl(null);
  };

  const listenerAudioFileOpened = (file) => {
    if (file) {
      setAudioFile(file);
      setAudioContent(true);
    }
  };

  return (
    <>
      <WhiteBoardListener
        socket={whiteBoardSocket}
        listenerAudioFileOpened={listenerAudioFileOpened}
        setImageUrl={setImageUrl}
        room={room}
      />
      <Header />
      <div className="fixed flex h-full w-full justify-center">
         <FloatButton
          className="floatButtonImage iconImageFloat"
          style={{ left: 100, bottom: 12 }}
          icon={<BsTriangle className="iconImageFloat" style={{ transform: "rotate(-90deg)" }} />}
        /> 
        <FloatButton
          icon={<PlayCircleOutlined className="iconAudioFloat" />}
          style={{ left: "48%", bottom: 12 }}
          onClick={handleFloatButtonClick}
          className="floatButtonAudio iconAudioFloat"
        />

        <FloatButton
          className="floatButtonImage iconImageFloat"
          style={{ left: "51%", bottom: 12 }}
          icon={<FileImageOutlined className="iconImageFloat" />}
          onClick={handleImageButtonClick}
        />
        <FloatButton
          className="floatButtonImage iconImageFloat"
          style={{ left: "54%", bottom: 12 }}
          icon={<TbMessage className="iconImageFloat" />}
        />
       <FloatButton
          className="floatButtonImage iconImageFloat"
          style={{ right: 100, bottom: 12 }}
          icon={<BsTriangle className="iconImageFloat" style={{ transform: "rotate(90deg)" }} />}
        /> 
         
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <div className="relative top-[0.5rem] h-[91%] w-[98%] bg-white">
          <WhiteBoard socket={whiteBoardSocket} context={context} />
          <AudioPlayer
            audioContent={audioContent}
            setAudioContent={setAudioContent}
            file={audioFile}
            handleCloseAudioPlayer={handleCloseAudioPlayer}
          />
          <BoardImage
            url={imageUrl}
            onClose={handleCloseImage}
            socket={whiteBoardSocket}
            context={context}
          />
        </div>
      </div>
    </>
  );
}

export default WhiteBoardDashBoard;
