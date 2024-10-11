import { useState, useEffect } from "react";
import { extractPlatform, extractVideoId } from "../../helpers/extractVideoId";

function VideoModal({ selectedTeacher, closeModal }) {
  const [previewUrl, setPreviewUrl] = useState(selectedTeacher.video);
  const [videoPlatform, setVideoPlatform] = useState(null);

  useEffect(() => {
    const detectVideoPlatform = () => {
      const platform = extractPlatform(selectedTeacher.video);
      if (platform) {
        updateVideoInput(platform);
      }
    };
    detectVideoPlatform();
  }, [selectedTeacher.video]);

  const updateVideoInput = (platform) => {
    setVideoPlatform(platform);
    const videoId = extractVideoId(selectedTeacher.video, platform);
    if (videoId) {
      const url = platform === "Youtube"
        ? `https://www.youtube.com/embed/${videoId}`
        : `https://player.vimeo.com/video/${videoId}`;
      setPreviewUrl(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {selectedTeacher.firstName} {selectedTeacher.lastName} - Video
        </h2>
        <iframe
          width="100%"
          height="340"
          src={previewUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${videoPlatform} video`}
        ></iframe>
        <button
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={closeModal}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default VideoModal;
