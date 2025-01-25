import React from 'react';

const RemoteVideo = ({ remoteVideoRefs, remoteVideos, remoteAudioLevel }) => {
  return (
    <>
      {remoteVideos.length > 0 && (
        <div className="w-full h-48 bg-black rounded overflow-hidden relative">
          <video
            ref={(el) => (remoteVideoRefs.current[remoteVideos[0]] = el)}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            Asistente
          </div>
          {Object.entries(remoteAudioLevel).slice(0, 1).map(([attendeeId, data]) => (
            <div key={attendeeId} className="absolute bottom-2 right-2 flex items-center space-x-2">
              <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${data.volume}%` }}
                />
              </div>
              {data.muted && (
                <span className="text-red-500 text-xs">Muteado</span>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RemoteVideo;