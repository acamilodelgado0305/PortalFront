/*
   npm i tldraw
   npm i @tldraw/sync 
   son dos librerias distintas, una es para la pizarrra otra
   para la sincronización 

   http://localhost:5173/whiteboard

*/
import { useState } from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import { useParams } from "react-router-dom";
// componenst
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx"

import "tldraw/tldraw.css";


function WhiteBoard() {
  const [audioBar, setAudioBar] = useState(false);
  const [name, setName] = useState("cancion.mp3");
  const { room } = useParams();
  const store = useSyncDemo({ roomId: room || "myapp-abc123" });

  return (
    <>
      <Header />
      <div className="fixed flex h-full w-full justify-center bg-[#7066e0]">
        <div className="h-[92%] w-[90%] pt-[0.5rem]">
          <Tldraw store={store}>
            <AudioPlayer audioBar={audioBar} name={name}/>           
          </Tldraw>
        </div>
      </div>
    </>
  );
}

export default WhiteBoard;
