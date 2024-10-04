import React, { useState, useRef } from "react";
import { Form, Radio, message } from "antd";
import VideoUpload from "./components/VideoStep/VideoUpload.jsx";
import YouTubeInput from "./components/VideoStep/YouTubeInput.jsx";
import VideoPreview from "./components/videoStep/VideoPreview.jsx";
import VideoRecorder from "./components/videoStep/VideoRecorder.jsx";
import { uploadImage } from "../../../../services/utils.js";

const VideoStep = () => {
  const [form] = Form.useForm();
  const [videoUploadMethod, setVideoUploadMethod] = useState("file");
  const [urlPreview, setUrlPreview] = useState("");

  const handleVideoUpload = async (info) => {
    const file = info.file;
    const contentType = file.type;
    const response = await uploadImage(file, contentType);

    if (response.success) {
      message.success(`${info.file.name} video uploaded successfully`);
      setUrlPreview(response.url);
    } else {
      message.error(`${info.file.name} upload failed. It may be due to the file size. Please try again.`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Video Introduction</h2>
      <p className="mb-4 text-gray-600">Upload a video introduction to showcase your teaching style and personality</p>
      {urlPreview.length === 0 ? (
        <Form form={form} layout="vertical">
          <Form.Item label="Video Upload Method" required>
            <Radio.Group
              onChange={(e) => setVideoUploadMethod(e.target.value)}
              value={videoUploadMethod}
            >
              <Radio value="file">Upload File</Radio>
              <Radio value="record">Record Video</Radio>
              <Radio value="youtube">YouTube Link</Radio>
            </Radio.Group>
          </Form.Item>

          {videoUploadMethod === "file" && (
            <VideoUpload handleVideoUpload={handleVideoUpload} />
          )}

          {videoUploadMethod === "record" && (
            <VideoRecorder setUrlPreview={setUrlPreview} form={form} /> // Usar el nuevo componente
          )}

          {videoUploadMethod === "youtube" && (
            <YouTubeInput setUrlPreview={setUrlPreview} />
          )}
        </Form>
      ) : (
        <VideoPreview urlPreview={urlPreview} setUrlPreview={setUrlPreview} />
      )}
    </div>
  );
};

export default VideoStep;
