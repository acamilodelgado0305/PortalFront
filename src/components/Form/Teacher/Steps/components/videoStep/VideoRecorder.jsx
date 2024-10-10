import React, { useRef, useState } from "react";
import { Button, message } from "antd";
import { VideoCameraOutlined, PauseOutlined, DeleteOutlined } from "@ant-design/icons";
import { uploadImage } from "../../../../../../services/utils";

const VideoRecorder = ({ setUrlPreview, form }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "recorded_video.webm", { type: "video/webm" });
        const response = await uploadImage(file, file.type);

        if (response.success) {
          setUrlPreview(response.url);
          form.setFieldsValue({ video: response.url });
        } else {
          message.error("Upload failed. Please try again.");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      message.error("Failed to access camera. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const deleteRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      chunksRef.current = [];
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setUrlPreview(null);
      form.setFieldsValue({ video: null });
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} autoPlay muted />
      {isRecording && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {isPaused ? "Paused" : "Recording"}
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          icon={<VideoCameraOutlined />}
          style={{ marginRight: "10px" }}
        >
          {isRecording ? "Stop" : "Start"}
        </Button>
        {isRecording && (
          <>
            <Button
              onClick={pauseRecording}
              icon={<PauseOutlined />}
              style={{ marginRight: "10px" }}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              onClick={deleteRecording}
              icon={<DeleteOutlined />}
              danger
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;