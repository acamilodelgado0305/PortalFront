import React, { useState, useEffect,useRef } from "react";
import { Form, Radio } from "antd";
import VideoUpload from "./components/videoStep/VideoUpload.jsx";
import VideoUrlInput from "./components/videoStep/VideoUrlInput.jsx";
import VideoPreview from "./components/videoStep/VideoPreview.jsx";
import VideoRecorder from "./components/videoStep/VideoRecorder.jsx";
import { fileUpload } from "../../../../helpers/fileUpload";

const VideoStep = ({ onChange, setIsVerified }) => {
  const [form] = Form.useForm();
  const [videoUploadMethod, setVideoUploadMethod] = useState("file");
  const [urlPreview, setUrlPreview] = useState("");

  const handleVideoUpload = async (info) => {
    const acceptedFiles = [info.file];
    const url = await fileUpload(acceptedFiles, 'video')
    setUrlPreview(url);
  };

  useEffect(()=>{
    onChange({'video':urlPreview})
    setIsVerified(urlPreview.trim() !== "");
  },[urlPreview])
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
              <Radio value="vimeo">Vimeo Link</Radio>
            </Radio.Group>
          </Form.Item>

          {videoUploadMethod === "file" && (
            <VideoUpload handleVideoUpload={handleVideoUpload} />
          )}

          {videoUploadMethod === "record" && (
            <VideoRecorder setUrlPreview={setUrlPreview} form={form} />
          )}

          {videoUploadMethod === "youtube" && (
            <VideoUrlInput plataform={'Youtube'} setUrlPreview={setUrlPreview} />
          )}
           {videoUploadMethod === "vimeo" && (
            <VideoUrlInput plataform={'Vimeo'}  setUrlPreview={setUrlPreview} />
          )}
        </Form>
      ) : (
        <VideoPreview urlPreview={urlPreview} setUrlPreview={setUrlPreview} />
      )}
    </div>
  );
};

export default VideoStep;
