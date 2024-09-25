import React, { useState, useRef } from 'react';
import { Form, Input, Radio, Upload, Button, message } from 'antd';
import { UploadOutlined, VideoCameraOutlined, LinkOutlined } from '@ant-design/icons';

const VideoStep = () => {
  const [form] = Form.useForm();
  const [videoUploadMethod, setVideoUploadMethod] = useState('file');
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleVideoUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} video uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} video upload failed.`);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded_video.webm', { type: 'video/webm' });
        const fileList = {
          file,
          fileList: [{ uid: '-1', name: 'recorded_video.webm', status: 'done', url: URL.createObjectURL(blob) }],
        };
        form.setFieldsValue({ video: fileList });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      message.error('Failed to access camera. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Video Introduction</h2>
      <p className="mb-4 text-gray-600">
        Upload a video introduction to showcase your teaching style and personality
      </p>

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

        {videoUploadMethod === 'file' && (
          <Form.Item
            name="video"
            rules={[{ required: true, message: 'Please upload a video' }]}
          >
            <Upload
              accept="video/*"
              maxCount={1}
              onChange={handleVideoUpload}
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Upload Video</Button>
            </Upload>
          </Form.Item>
        )}

        {videoUploadMethod === 'record' && (
          <div>
            <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} autoPlay muted />
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              icon={<VideoCameraOutlined />}
              className="mt-2"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>
        )}

        {videoUploadMethod === 'youtube' && (
          <Form.Item
            name="youtubeLink"
            rules={[
              { required: true, message: 'Please enter a YouTube link' },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input prefix={<LinkOutlined />} placeholder="Enter YouTube video link" />
          </Form.Item>
        )}

    
      </Form>
    </div>
  );
};

export default VideoStep;