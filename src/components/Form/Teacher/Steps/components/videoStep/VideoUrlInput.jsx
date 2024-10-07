import React from "react";
import { Form, Input } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { extractVideoId } from "../../../../../../helpers/extractVideoId";


const VideoUrlInput = ({ plataform, setUrlPreview }) => {
  const handleVideoInput = (e) => {
    const videoId = extractVideoId(e.target.value, plataform);
    if (videoId) {
      const url = plataform === "Youtube"
        ? `https://www.youtube.com/embed/${videoId}`
        : `https://player.vimeo.com/video/${videoId}`;
      setUrlPreview(url);
    }
  };

  return (
    <Form.Item
      name="videoLink"
      rules={[
        { required: true, message: `Please enter a ${plataform} link` },
        { type: "url", message: "Please enter a valid URL" }
      ]}
    >
      <Input 
        prefix={<LinkOutlined />} 
        placeholder={`Enter ${plataform} video link`} 
        onBlur={handleVideoInput} 
      />
    </Form.Item>
  );
};

export default VideoUrlInput;
