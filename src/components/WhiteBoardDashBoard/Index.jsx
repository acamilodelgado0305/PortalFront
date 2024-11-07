import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

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
import BottomControlsBar from "./components/BottomControlsBar/Index.jsx";


function WhiteBoardDashBoard() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioContent, setAudioContent] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { room } = useParams();
  const whiteBoardSocket = useWhiteBoardSocket();
  const context = useContext(WhiteBoardContext);

useEffect(()=>{ 
  const handleClearImages = ()=>{
    setImageUrl("")
  }
  window.addEventListener('clearWhiteBoardImages', handleClearImages);
  return () => {
    window.removeEventListener('clearWhiteBoardImages', handleClearImages);
  };},[])
 


  useEffect(() => {}, [whiteBoardSocket]);



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
     <BottomControlsBar
          whiteBoardSocket={whiteBoardSocket}
          setImageUrl={setImageUrl}
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
