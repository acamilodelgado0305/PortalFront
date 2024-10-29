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
import { PlayCircleOutlined } from "@ant-design/icons";
// componenst
import Header from "../Header.jsx";
import AudioPlayer from "./components/AudioPlayer/index.jsx"

import "tldraw/tldraw.css";

  /*bg-[#7066e0] <Tldraw store={store}>
          </Tldraw> */
function WhiteBoard() {
  
  const [name, setName] = useState("cancion.mp3");
  const [audioContent, setAudioContent] = useState(true);
  const { room } = useParams();
  const store = useSyncDemo({ roomId: room || "myapp-abc123" });

  return (
    <>
      <Header />
      <div className="fixed flex h-full w-full justify-center bg-[#7066e0]  ">
      <PlayCircleOutlined className="absolute top-[1.5rem] left-[1.4rem] text-white text-3xl cursor-pointer" onClick={()=>setAudioContent(!audioContent)}/>
        <div className="h-[92%] w-[90%] pt-[0.5rem]">
       <Tldraw store={store}> 
           <AudioPlayer audioContent={audioContent} setAudioContent={setAudioContent} name={name}/> 
         </Tldraw>  
           </div>
      </div>
    </>
  );
}

export default WhiteBoard;
