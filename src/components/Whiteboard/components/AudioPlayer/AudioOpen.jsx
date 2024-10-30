import React, { useEffect, useState, useRef } from 'react';
import Controlls from "./Controlls";
import { CloseOutlined } from "@ant-design/icons";
import ProgressBar from './ProgressBar';

function AudioOpen({  toggleAudioPlayer, setToggleAudioPlayer, file }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const url = URL.createObjectURL(file);


    useEffect(() => {
        const audio = audioRef.current;
        if (audio && !duration) {
            const handleLoadedMetadata = () => {
            setDuration(audio.duration);
          };
    
          const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
          }; 

      
    
          audio.addEventListener('loadedmetadata', handleLoadedMetadata);
          audio.addEventListener('timeupdate', handleTimeUpdate);
    
          return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
          };
        }
      }, [url, duration]);

      const handleSeek = seconds => {
        if (audioRef.current) {
          const newTime = Math.min(
            Math.max(audioRef.current.currentTime + seconds, 0),
            duration
          );
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      };



    const handleTimeChange = (newTime) => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    return (
        <div
            className={
                'animate-audioOpen absolute w-[700px] h-[100px] border-2 border-[#7066E0] backdrop-blur-[10px] bg-[#7066E0]/50 rounded-[15px] top-[50px] left-[50px] z-[1] overflow-hidden'
            }
            style={{
                top: window.innerHeight < 600 ? '23vh' : '',
                right: window.innerHeight < 600 && '50px'
            }}
        >
            {/* Botón para cerrar el reproductor */}
            <CloseOutlined className="absolute top-2 right-2 text-white hover:text-gray transition duration-200" 
                onClick={() => {
                    setToggleAudioPlayer(!toggleAudioPlayer); 
                }}
            />

            {/* Controles de audio */}
            <Controlls audioRef={audioRef} handleSeek={handleSeek} currentTime={currentTime} duration={duration} />

            {/* Barra de progreso */}
            <ProgressBar currentTime={currentTime} duration={duration} setCurrentTime={handleTimeChange} />

            {/* Elemento de audio oculto */}
            {file && (
                <audio ref={audioRef} src={url} preload="metadata" />
            )}
        </div>
    );
}

export default AudioOpen;




