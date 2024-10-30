import { useState, useEffect, useRef } from 'react';

function ProgressBar({ currentTime, duration, setCurrentTime }) {
  const [progressWidth, setProgressWidth] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (duration > 0) {
      setProgressWidth((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  const calculateProgressBarWidth = () => {
    if (progressRef.current) {
      setProgressBarWidth(progressRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    calculateProgressBarWidth();
    window.addEventListener('resize', calculateProgressBarWidth); 
    return () => window.removeEventListener('resize', calculateProgressBarWidth);
  }, []);

  const getCirclePosition = () => {
    return (progressWidth / 100) * progressBarWidth;
  };

  const handleMouseMove = (event) => {
    if (isDragging && progressRef.current) {
      const { left, width } = progressRef.current.getBoundingClientRect();
      const mouseX = event.clientX - left;
      const newProgress = Math.max(0, Math.min(mouseX / width, 1));
      setProgressWidth(newProgress * 100);
      setCurrentTime(newProgress * duration); 
    }
  };

  const handleProgressClick = (event) => {
    if (progressRef.current) {
      const { left, width } = progressRef.current.getBoundingClientRect();
      const clickX = event.clientX - left;
      const newProgress = Math.max(0, Math.min(clickX / width, 1)); 
      setProgressWidth(newProgress * 100);
      setCurrentTime(newProgress * duration); 
        }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const timeRemaining = duration - currentTime;

  return (
    <div className="relative flex items-center bottom-7 w-full pl-[40px] pr-[20px]">
      <div className="flex-1">
        <div
          className="h-[5px] bg-white w-full rounded"
          ref={progressRef}
          onClick={handleProgressClick} 
        />

        <div
          className="relative h-[6px] bg-[#8A82EB] rounded mt-[-5px]"
          style={{ width: `${progressWidth}%` }}
          onClick={handleProgressClick} 
        >
          <div
            className="absolute -top-2 w-3 h-3 mt-1 bg-[#8A82EB] rounded-full cursor-pointer"
            style={{ left: `${getCirclePosition() - 8}px` }} 
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      <div className=" ml-2 mt-[-2px] text-white text-sm">
        { formatTime(timeRemaining)}
      </div>
    </div>
  );
}

export default ProgressBar;
