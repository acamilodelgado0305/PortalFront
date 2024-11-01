import { useState } from "react";
import { Rnd } from 'react-rnd';

import AudioClose from "./AudioClose";
import AudioOpen from "./AudioOpen";

function AudioPlayer({ file, audioContent, handleCloseAudioPlayer }) {
  const [toggleAudioPlayer, setToggleAudioPlayer] = useState(false);

  if (!audioContent) {
    return null;
  }

  return (
    <>
      {!toggleAudioPlayer ? (
        <AudioClose 
          name={file?.name || 'cancion.mp3'} 
          audioBar={toggleAudioPlayer} 
          setAudioBar={setToggleAudioPlayer} 
          onClose={handleCloseAudioPlayer} 
        />
      ) : (
       
        <Rnd
          default={{
            x: 0, 
            y: 0, 
          }}
          dragHandleClassName={'drag-handle'}
        >
          <AudioOpen 
            toggleAudioPlayer={toggleAudioPlayer} 
            setToggleAudioPlayer={setToggleAudioPlayer} 
            file={file} 
          />
        </Rnd>
      )}
    </>
  );
}

export default AudioPlayer;
