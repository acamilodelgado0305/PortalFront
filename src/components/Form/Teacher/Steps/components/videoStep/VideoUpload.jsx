import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const VideoUpload = ({ handleVideoUpload }) => (
  <Form.Item name="video" rules={[{ required: true, message: "Please upload a video" }]}>
    <Upload accept="video/*" maxCount={1} onChange={handleVideoUpload} beforeUpload={() => false}>
      <Button icon={<UploadOutlined />}>Upload Video</Button>
    </Upload>
  </Form.Item>
);

export default VideoUpload;
