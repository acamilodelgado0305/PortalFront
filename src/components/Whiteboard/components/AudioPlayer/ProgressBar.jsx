import { useState, useEffect, useRef } from 'react';

function ProgressBar({ currentTime, duration, setCurrentTime }) {
  console.log('duration time '+duration)
  const [progressWidth, setProgressWidth] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse down event to start dragging
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update progress width based on currentTime and duration
  useEffect(() => {
    if (duration > 0) {
      setProgressWidth((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  // Calculate the width of the progress bar when the component mounts
  const calculateProgressBarWidth = () => {
    if (progressRef.current) {
      setProgressBarWidth(progressRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    calculateProgressBarWidth();
    window.addEventListener('resize', calculateProgressBarWidth); // Recalculate on resize
    return () => window.removeEventListener('resize', calculateProgressBarWidth); // Cleanup on unmount
  }, []);

  // Function to get the position of the draggable circle
  const getCirclePosition = () => {
    return (progressWidth / 100) * progressBarWidth;
  };

  // Handle mouse move during dragging
  const handleMouseMove = (event) => {
    if (isDragging && progressRef.current) {
      const { left, width } = progressRef.current.getBoundingClientRect();
      const mouseX = event.clientX - left;
      const newProgress = Math.max(0, Math.min(mouseX / width, 1)); // Limit value between 0 and 1
      setProgressWidth(newProgress * 100);
      setCurrentTime(newProgress * duration); // Update current time
    }
  };

  // Handle click on the progress bar (both white and violet areas)
  const handleProgressClick = (event) => {
    if (progressRef.current) {
      const { left, width } = progressRef.current.getBoundingClientRect();
      const clickX = event.clientX - left;
      const newProgress = Math.max(0, Math.min(clickX / width, 1)); // Limit value between 0 and 1
      setProgressWidth(newProgress * 100);
      setCurrentTime(newProgress * duration); // Update current time
    }
  };

  // Add event listeners for dragging and cleanup
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

  // Calculate remaining time in mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const timeRemaining = duration - currentTime;

  return (
    <div className="relative flex items-center bottom-7 w-full pl-[40px] pr-[20px]">
      {/* Progress bar container */}
      <div className="flex-1">
        {/* Background line for the progress */}
        <div
          className="h-[5px] bg-white w-full rounded"
          ref={progressRef}
          onClick={handleProgressClick} // Add click event to update progress
        />

        {/* Foreground line representing the progress */}
        <div
          className="relative h-[6px] bg-[#8A82EB] rounded mt-[-5px]"
          style={{ width: `${progressWidth}%` }}
          onClick={handleProgressClick} // Add click event to violet line
        >
          {/* Draggable circle */}
          <div
            className="absolute -top-2 w-3 h-3 mt-1 bg-[#8A82EB] rounded-full cursor-pointer"
            style={{ left: `${getCirclePosition() - 8}px` }} // Adjust position based on width
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      {/* Display remaining time next to the progress bar */}
      <div className=" ml-2 mt-[-2px] text-white text-sm">
        { formatTime(timeRemaining)}
      </div>
    </div>
  );
}

export default ProgressBar;
