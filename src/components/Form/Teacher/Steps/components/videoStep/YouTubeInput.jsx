import React from "react";
import { Form, Input } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const YouTubeInput = ({ setUrlPreview }) => {
  const handleDownloadYoutube = (e) => {
    const extractYoutubeId = (url) => {
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const matches = url.match(regex);
      return matches ? matches[1] : null;
    };
    setUrlPreview(`https://www.youtube.com/embed/${extractYoutubeId(e.target.value)}`);
  };

  return (
    <Form.Item
      name="youtubeLink"
      rules={[{ required: true, message: "Please enter a YouTube link" }, { type: "url", message: "Please enter a valid URL" }]}
    >
      <Input prefix={<LinkOutlined />} placeholder="Enter YouTube video link" onBlur={handleDownloadYoutube} />
    </Form.Item>
  );
};

export default YouTubeInput;
