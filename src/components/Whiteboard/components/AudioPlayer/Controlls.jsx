import { useState, useEffect } from "react";
import {
    StepBackwardOutlined,
    BackwardOutlined,
    LeftOutlined,
    CaretRightOutlined,
    PauseOutlined,
    RightOutlined,
    StepForwardOutlined,
} from "@ant-design/icons";
import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

function Controlls({ handleSeek, audioRef, currentTime, duration }) {
    const [playing, setPlaying] = useState(true);
    const [isVolumeDialOpen, setIsVolumeDialOpen] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(100);
    const [lastPlayPauseClick, setLastPlayPauseClick] = useState(0);


    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        if(!playing) 
          {console.log('play')
             audio.play();

         } else {
          console.log('stop')
          audio.pause()};
      }
    }, [playing]);

    const togglePlayPause = () => {
     const now = Date.now();
    if (now - lastPlayPauseClick < 300) return;
    setLastPlayPauseClick(now);
    setPlaying(prev => !prev);
    };

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.volume = volumeLevel / 100; 
        }
    }, [volumeLevel, audioRef]);

    useEffect(() => {
        if (currentTime >= duration && duration > 0) {
            setPlaying(false);
        }
    }, [currentTime, duration]);

    return (
        <div className="controls flex justify-center h-full w-full pl-[15%] pt-6 space-x-6">
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
                <StepBackwardOutlined onClick={() => handleSeek(-5)} onTouchStart={() => handleSeek(-5)} />
            </button>
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
                <BackwardOutlined onClick={() => handleSeek(-1)} onTouchStart={() => handleSeek(-1)} />
            </button>
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
                <LeftOutlined />
            </button>
            {playing ? (
                <button className="animate-playControl flex justify-center text-3xl text-[#7066e0] hover:text-[#8A82EB] transition-all duration-500" onClick={togglePlayPause}>
                    <CaretRightOutlined />
                </button>
            ) : (
                <button className="flex justify-center text-3xl text-white transition-all duration-500 animate-textChange" onClick={togglePlayPause}>
                    <PauseOutlined />
                </button>
            )}
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
                <RightOutlined onClick={() => handleSeek(1)} onTouchStart={() => handleSeek(1)} />
            </button>
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
                <StepForwardOutlined onClick={() => handleSeek(5)} onTouchStart={() => handleSeek(5)} />
            </button>
            <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500 mt-[2px]" onClick={() => setIsVolumeDialOpen(!isVolumeDialOpen)}>
                {volumeLevel === 0 ? <FaVolumeMute className="animate-textChange" /> : (volumeLevel <= 50 ? <FaVolumeDown /> : <FaVolumeUp />)}
            </button>

            {/* Componente VolumeSlider */}
            <VolumeSlider isOpen={isVolumeDialOpen} setVolumeLevel={setVolumeLevel} volumeLevel={volumeLevel} />
        </div>
    );
}

function VolumeSlider({ isOpen, setVolumeLevel, volumeLevel }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (event) => {
        if (isDragging) {
            const slider = event.currentTarget.getBoundingClientRect();
            const newWidth = Math.min(Math.max(event.clientX - slider.left, 0), slider.width);
            const newVolume = (newWidth / slider.width) * 100;
            setVolumeLevel(newVolume);
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleClick = (event) => {
        const slider = event.currentTarget.getBoundingClientRect();
        const newWidth = Math.min(Math.max(event.clientX - slider.left, 0), slider.width);
        const newVolume = (newWidth / slider.width) * 100;
        setVolumeLevel(newVolume);
    };

    return (
        <div
            className={`relative w-24 h-[3.5px] bg-gray-200 rounded mt-[15px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div
                className="absolute h-full bg-[#7066E0] rounded"
                style={{ width: `${volumeLevel}%` }}
            />
            <div
                className="absolute h-3 w-3 bg-white rounded-full border border-gray-300"
                style={{ left: `calc(${volumeLevel}% - 8px)`, top: '-4px' }}
            />
        </div>
    );
}

export default Controlls;
