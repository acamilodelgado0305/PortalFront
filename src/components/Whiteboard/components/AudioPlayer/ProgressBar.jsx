import { useState, useEffect, useRef } from 'react';

function ProgressBar({ currentTime, duration, setCurrentTime }) {
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

  return (
    <div className="relative bottom-5 w-full px-[20px]">
      {/* Background line for the progress */}
      <div className="h-[2px] bg-white w-full rounded" ref={progressRef} />

      {/* Foreground line representing the progress */}
      <div
        className="relative h-[4px] bg-[#4B2B94] rounded mt-[-4px]"
        style={{ width: `${progressWidth}%` }}
      >
        {/* Draggable circle */}
        <div
          className="absolute -top-2 w-3 h-3 mt-1 bg-[#4B2B94] rounded-full cursor-pointer"
          style={{ left: `${getCirclePosition() - 8}px` }} // Adjust position based on width
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
