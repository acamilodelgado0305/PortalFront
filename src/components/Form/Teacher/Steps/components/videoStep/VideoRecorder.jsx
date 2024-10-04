import React, { useRef, useState } from "react";
import { Button, message } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { uploadForm } from "../../../../../../services/utils";

const VideoRecorder = ({ setUrlPreview, form }) => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "recorded_video.webm", { type: "video/webm" });
        const response = await uploadForm(file, file.type);

        if (response.success) {
          setUrlPreview(response.url);
          form.setFieldsValue({ video: response.url });
        } else {
          message.error("Upload failed. Please try again.");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      message.error("Failed to access camera. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} autoPlay muted />
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        icon={<VideoCameraOutlined />}
        className="mt-2"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};

export default VideoRecorder;
