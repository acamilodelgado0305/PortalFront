import React from 'react';

const LocalVideo = ({ localVideoRef, localVideo }) => {
  return (
    <>
      {localVideo && (
        <div className="w-full h-48 bg-black rounded overflow-hidden relative">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover transform -scale-x-100"
            autoPlay
            playsInline
          />
          <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            Anfitrión
          </div>
        </div>
      )}
    </>
  );
};

export default LocalVideo;