import React from 'react';
import { HiPhoneXMark } from 'react-icons/hi2';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';

const Controls = ({ handleClose, toggleCamera, isCameraOff, toggleMute, isMuted }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
      <button
        onClick={handleClose}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
      >
        <HiPhoneXMark className="text-xl" />
      </button>

      <button
        onClick={toggleCamera}
        className={`${isCameraOff ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80 text-white p-2 rounded-full`}
      >
        {isCameraOff ? <FiVideoOff className="text-xl" /> : <FiVideo className="text-xl" />}
      </button>

      <button
        onClick={toggleMute}
        className={`${isMuted ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80 text-white p-2 rounded-full`}
      >
        {isMuted ? <FiMicOff className="text-xl" /> : <FiMic className="text-xl" />}
      </button>
    </div>
  );
};

export default Controls;