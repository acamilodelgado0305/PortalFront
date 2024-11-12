import { useState, useEffect } from "react";
import {
  StepBackwardOutlined,
  BackwardOutlined,
  LeftOutlined,
  CaretRightOutlined,
  PauseOutlined,
  RightOutlined,
  StepForwardOutlined,
  ForwardOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

function Controlls({
  handleSeek,
  audioRef,
  currentTime,
  duration,
  setCurrentTime,
}) {
  const [playing, setPlaying] = useState(false);
  const [isVolumeDialOpen, setIsVolumeDialOpen] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(100);
  const [lastPlayPauseClick, setLastPlayPauseClick] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (!playing) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playing]);

  const togglePlayPause = () => {
    const now = Date.now();
    if (now - lastPlayPauseClick < 300) return;
    setLastPlayPauseClick(now);
    setPlaying(!playing);
  };
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = volumeLevel / 100;
    }
  }, [volumeLevel, audioRef]);

  useEffect(() => {
    if (currentTime >= duration) {
      setPlaying(!playing);
      handleRestart();
    }
  }, [currentTime, duration]);

  const buttonClasessTailwind  = "flex justify-center text-lg md:text-3xl text-white transition-all duration-500 hover:text-[#8A82EB]";

  return (
    <div className="controls flex h-full w-full justify-center space-x-3 md:space-x-6 pl-[10%]  md:pl-[12%] pt-6">
      <button
        className="drag-handle flex justify-center text-lg md:text-3xl text-[#8A82EB] transition-all duration-500"
        style={{ cursor: "grab" }}
      >
        <FullscreenOutlined style={{ cursor: "grabbing" }} />{" "}
      </button>
      <button className={buttonClasessTailwind}>
        <StepBackwardOutlined
          onClick={handleRestart}
          onTouchStart={handleRestart}
        />
      </button>
      <button className={buttonClasessTailwind}>
        <BackwardOutlined
          onClick={() => handleSeek(-5)}
          onTouchStart={() => handleSeek(-5)}
        />
      </button>
      <button className={buttonClasessTailwind}>
        <LeftOutlined
          onClick={() => handleSeek(-1)}
          onTouchStart={() => handleSeek(-1)}
        />
      </button>
      {playing ? (
        <button
          className="animate-playControl flex justify-center text-lg md:text-3xl text-[#7066e0] transition-all duration-500 hover:text-[#8A82EB]"
          onClick={togglePlayPause}
        >
          <CaretRightOutlined />
        </button>
      ) : (
        <button
          className="animate-textChange flex justify-center text-lg md:text-3xl text-white transition-all duration-500"
          onClick={togglePlayPause}
        >
          <PauseOutlined />
        </button>
      )}
      <button className={buttonClasessTailwind}>
        <RightOutlined
          onClick={() => handleSeek(1)}
          onTouchStart={() => handleSeek(1)}
        />
      </button>
      <button className={buttonClasessTailwind}>
        <ForwardOutlined
          onClick={() => handleSeek(5)}
          onTouchStart={() => handleSeek(5)}
        />
      </button>

      <button className={buttonClasessTailwind}>
        <StepForwardOutlined
          onClick={() => handleSeek(5)}
          onTouchStart={() => handleSeek(5)}
        />
      </button>

      {/* Componente VolumeSlider */}
      <VolumeSlider
        isOpen={isVolumeDialOpen}
        setVolumeLevel={setVolumeLevel}
        volumeLevel={volumeLevel}
        setIsVolumeDialOpen={setIsVolumeDialOpen}
      />
    </div>
  );
}

function VolumeSlider({ isOpen, setVolumeLevel, volumeLevel, setIsVolumeDialOpen }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (event) => {
    if (isDragging) {
      const slider = event.currentTarget.getBoundingClientRect();
      const newWidth = Math.min(
        Math.max(event.clientX - slider.left, 0),
        slider.width,
      );
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
    const newWidth = Math.min(
      Math.max(event.clientX - slider.left, 0),
      slider.width,
    );
    const newVolume = (newWidth / slider.width) * 100;
    setVolumeLevel(newVolume);
  };

  return (
    <>
      <button
        className="mt-[2px] flex justify-center text-lg md:text-3xl text-white transition-all duration-500 hover:text-[#8A82EB]"
        onClick={() => setIsVolumeDialOpen(!isOpen)}
      >
        {volumeLevel === 0 ? (
          <FaVolumeMute className="text-[#8A82EB]" />
        ) : volumeLevel <= 50 ? (
          <FaVolumeDown />
        ) : (
          <FaVolumeUp />
        )}
      </button>
      <div
        className={`relative mt-[10px] md:mt-[15px] h-[3.5px] w-24 rounded bg-gray-200 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className="absolute h-full rounded bg-[#7066E0]"
          style={{ width: `${volumeLevel}%` }}
        />
        <div
          className="absolute h-3 w-3 rounded-full border border-gray-300 bg-white"
          style={{ left: `calc(${volumeLevel}% - 8px)`, top: "-4px" }}
        />
      </div>
    </>
  );
}

export default Controlls;
