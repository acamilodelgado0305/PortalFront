import { useState, useEffect, useRef } from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { events }  from "../../enums/whiteboardEvents.js";

// components
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx";
import { useWhiteBoardSocket  } from './WhiteBoardSocketProvider'; 

import "tldraw/tldraw.css";
import "./animations.css";
import WhiteBoardListener from "./components/WhiteBoardSocket/WhiteBoardListener.jsx";
import { uploadFile } from "../../services/utils.js";

function WhiteBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false); 
  const { room } = useParams();
  const whiteBoardSocket = useWhiteBoardSocket();
  const store = useSyncDemo({ roomId: room || "myapp-abc123" }); 
  

  const fileInputRef = useRef(null);

  const handleFloatButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async(event) => {
    console.log('Prueba de enums ' + events.AUDIOFILE_OPENED )
    const file = event.target.files[0]; 
    if (file) {
       event.target.value = null; 
      const data = await uploadFile(file,file.type)
      if (whiteBoardSocket) {
        console.log('Hay socket')
             whiteBoardSocket.emit(events.AUDIOFILE_OPENED, 
          { 
            name: file.name,
            url: data.url,
            room: room 
          });
      } 
    }
  };
 const handleCloseAudioPlayer = () => {
    setAudioContent(false);
    setAudioFile(null);
  };


  /* prop in <WhiteBoardListener/>  */
  const listenerAudioFileOpened = (file) =>{
    if (file) {
      setAudioFile(file); 
      setAudioContent(true);
    }
  }
  
  
 
  useEffect(()=>{},[audioContent])


  return (
<>
      <WhiteBoardListener 
      socket={whiteBoardSocket}
      listenerAudioFileOpened={listenerAudioFileOpened}
      room={room}
      />
      <Header  />
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

        <div className="h-[91%] w-[90%] pt-[0.5rem]"> 
         
            <Tldraw store={store}>   
               <AudioPlayer 
                audioContent={audioContent} 
                setAudioContent={setAudioContent} 
                file={audioFile} 
                handleCloseAudioPlayer={handleCloseAudioPlayer} 
              />
              <div className="hidden md:block">
              <div className="coverWatermark absolute bottom-0 right-0  bg-white w-[120px] h-[45px] z-[999] " ></div></div>
            </Tldraw>
          
        </div>
      </div>
</>
  );
}

export default WhiteBoard;
