import { useState } from "react";
import {
    StepBackwardOutlined,
    BackwardOutlined,
    LeftOutlined,
    CaretRightOutlined,
    PauseOutlined,
    RightOutlined,
    StepForwardOutlined,
    SoundOutlined,
} from "@ant-design/icons";
import './controlls.css';

function Controlls() {
  const [play, setPlay] = useState(true);
  const [isVolumeDialOpen, setIsVolumeDialOpen] =useState(false);

 // Nivel de volumen inicial

  return (
    <div className="controls flex justify-center h-full w-full pl-[15%] pt-6 space-x-6">
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <StepBackwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <BackwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <LeftOutlined />
      </button>
      {play ? (
        <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500" onClick={() => setPlay(!play)}>
          <CaretRightOutlined />
        </button>
      ) : (
        <button className="flex justify-center text-3xl text-white transition-all duration-500 animate-textChange" onClick={() => setPlay(!play)}>
          <PauseOutlined />
        </button>
      )}
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <RightOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <StepForwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500" onClick={() => setIsVolumeDialOpen(!isVolumeDialOpen)}>
        <SoundOutlined />
      </button>

      {/* Componente VolumeSlider */}
        <VolumeSlider isOpen={isVolumeDialOpen}  />
    </div>
  );
}

export default Controlls;


function VolumeSlider({ isOpen }) {
    const [isDragging, setIsDragging] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(50); // Nivel de volumen inicial
  
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