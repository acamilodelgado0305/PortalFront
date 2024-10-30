import { useState } from "react"
import AudioClose from "./AudioClose"
import AudioOpen from "./AudioOpen"
function AudioPlayer({ file, audioContent, handleCloseAudioPlayer }) {
  const [audioBar, setAudioBar] = useState(false);
  if(!audioContent){
    return null
  }


  return (
    <>
      {!audioBar ? (
        <AudioClose name={file?.name || 'cancion.mp3'} audioBar={audioBar} setAudioBar={setAudioBar} onClose={handleCloseAudioPlayer}  />) :(
        <AudioOpen name={file?.name || 'cancion.mp3'} audioBar={audioBar} setAudioBar={setAudioBar} />)
      }
    </>
  )
}

export default AudioPlayer

