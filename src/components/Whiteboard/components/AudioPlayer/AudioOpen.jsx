import { useEffect, useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons'; // Adjust import based on your setup
import Controlls from './Controlls'; // Adjust the import based on your setup
import ProgressBar from './ProgressBar'; // Adjust the import based on your setup

function AudioOpen({ toggleAudioPlayer, setToggleAudioPlayer, file }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const url = URL.createObjectURL(file);

    useEffect(() => {
        const audio = audioRef.current;

        if (audio ) {
            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
                console.log('Duration ', audio.duration)
            };

            const handleTimeUpdate = () => {
                /* setCurrentTime(audio.currentTime); //esto es lo que no funciona ¿Será por sincronia? */
                console.log('current time ', audio.currentTime)
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }

        return () => {
            URL.revokeObjectURL(url); // Clean up the URL when the component unmounts
        };
    }, [url]); // Use url in the dependency array

    const handleSeek = (seconds) => {
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
            className="animate-audioOpen absolute w-[700px] h-[100px] border-2 border-[#7066E0] backdrop-blur-[10px] bg-[#7066E0]/50 rounded-[15px] top-[50px] left-[50px] z-[1] overflow-hidden"
            style={{
                top: window.innerHeight < 600 ? '23vh' : '',
                right: window.innerHeight < 600 ? '50px' : undefined,
            }}
        >
            <CloseOutlined
                className="absolute top-2 right-2 text-white hover:text-gray transition duration-200"
                onClick={() => {
                    setToggleAudioPlayer(!toggleAudioPlayer);
                }}
            />

            <Controlls
                audioRef={audioRef}
                handleSeek={handleSeek}
                currentTime={currentTime}
                duration={duration}
            />

            {/* ProgressBar component should be uncommented and used if needed */}
             <ProgressBar currentTime={currentTime} duration={duration} setCurrentTime={handleTimeChange} />

            {file && (
                <audio ref={audioRef} src={url}  />
            )}
        </div>
    );
}

export default AudioOpen;


