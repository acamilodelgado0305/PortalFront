import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { events } from "../../enums/whiteboardEvents.js";

// components
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx";
import WhiteBoard from "./components/WhiteBoard/Index.jsx";
import WhiteBoardProvider from "./components/WhiteBoard/WhiteBoardContext.jsx";

import { useWhiteBoardSocket } from "./WhiteBoardSocketProvider";
import "./animations.css";
import WhiteBoardListener from "./components/Socket/WhiteBoardListener.jsx";
import { uploadFile } from "../../services/utils.js";
import BoardImage from "./components/BoardImage/index.jsx";

function WhiteBoardDashBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false);
  const [imageUrl, setImageUrl ] = useState('');
  const { room } = useParams();
  const whiteBoardSocket = useWhiteBoardSocket();


  useEffect(()=>{
  },[whiteBoardSocket])

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
          page: '1'
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
          page:  '1'
        });
      }
      setImageUrl(data.url)
    }
  };

  const handleCloseAudioPlayer = () => {
    setAudioContent(false);
    setAudioFile(null);
  };

  const handleCloseImage = () => {
    setImageUrl(null)
  }
  
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
        setImageUrl={setImageUrl}
        room={room}
      />
      <Header />
      <div className="fixed flex h-full w-full justify-center bg-[#7066e0]">
        <FloatButton
          icon={<PlayCircleOutlined className="iconAudioFloat" />}
          onClick={handleFloatButtonClick}
          className="floatButtonAudio iconAudioFloat"
        />

        <FloatButton
          className="floatButtonImage iconImageFloat"
          style={{ bottom: 100 }}
          icon={<FileImageOutlined className="iconImageFloat" />}
          onClick={handleImageButtonClick} 
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

        <div className="relative top-[0.5rem] h-[91%] w-[90%] bg-white">
          <WhiteBoard socket={whiteBoardSocket} />
          <AudioPlayer
            audioContent={audioContent}
            setAudioContent={setAudioContent}
            file={audioFile}
            handleCloseAudioPlayer={handleCloseAudioPlayer}
          />
          <BoardImage url={imageUrl} onClose={handleCloseImage} socket={whiteBoardSocket}/>
        </div>
      </div>
    </WhiteBoardProvider>
  );
}

export default WhiteBoardDashBoard;