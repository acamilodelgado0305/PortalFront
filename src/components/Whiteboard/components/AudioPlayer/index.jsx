import { useState } from "react"
import AudioClose from "./AudioClose"
import AudioOpen from "./AudioOpen"
function AudioPlayer({ file, audioContent, handleCloseAudioPlayer }) {
  const [toggleAudioPlayer, setToggleAudioPlayer] = useState(false);
  if(!audioContent){
    return null
  }


  return (
    <>
      {!toggleAudioPlayer ? (
        <AudioClose name={file?.name || 'cancion.mp3'} audioBar={toggleAudioPlayer} setAudioBar={setToggleAudioPlayer} onClose={handleCloseAudioPlayer}  />) :(
        <AudioOpen  toggleAudioPlayer={toggleAudioPlayer} setToggleAudioPlayer={setToggleAudioPlayer} file={file} />)
      }
    </>
  )
}

export default AudioPlayer

