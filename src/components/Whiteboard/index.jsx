/*
   npm i tldraw
   npm i @tldraw/sync 
   son dos librerias distintas, una es para la pizarrra otra
   para la sincronización 

   http://localhost:5173/whiteboard

*/
import { useState, useRef } from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

// components
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx";

import "tldraw/tldraw.css";
import "./index.css";

function WhiteBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false); 
  const { room } = useParams();
  const store = useSyncDemo({ roomId: room || "myapp-abc123" });

  const fileInputRef = useRef(null);

  const handleFloatButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      setAudioFile(file); 
      setAudioContent(true); 

// quiero obtener la url del audio
      event.target.value = null; 
    }
  };
  
  const handleCloseAudioPlayer = () => {
    setAudioContent(false);
    setAudioFile(null);
  };

  return (
    <>
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
          style={{ display: 'none' }}
        />
        
        <div className="h-[92%] w-[90%] pt-[0.5rem]">
          <Tldraw store={store}> 
            <AudioPlayer 
              audioContent={audioContent} 
              setAudioContent={setAudioContent} 
              file={audioFile} 
              handleCloseAudioPlayer={handleCloseAudioPlayer} 
            />
          </Tldraw>  
        </div>
      </div>
    </>
  );
}

export default WhiteBoard;
