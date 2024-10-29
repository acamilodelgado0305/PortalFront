import { useState } from "react"
import AudioClose from "./AudioClose"
import AudioOpen from "./AudioOpen"
function AudioPlayer({ name, audioContent, setAudioContent }) {
  const [audioBar, setAudioBar] = useState(true);
  if(!audioContent){
    return null
  }

const handleCloseAudioPlayer = () =>{
  setAudioContent(!audioContent)
}

  return (
    <>
      {!audioBar ? (
        <AudioClose name={name} audioBar={audioBar} setAudioBar={setAudioBar} onClose={handleCloseAudioPlayer}  />) :(
        <AudioOpen name={name} audioBar={audioBar} setAudioBar={setAudioBar} />)
      }
    </>
  )
}

export default AudioPlayer

