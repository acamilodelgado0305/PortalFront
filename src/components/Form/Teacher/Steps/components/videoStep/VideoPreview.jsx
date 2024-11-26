import React from "react";
import { Button } from "antd";

const VideoPreview = ({ urlPreview, setUrlPreview }) => (
  <div>
    <iframe
      width="600"
      height="340"
      src={urlPreview}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="YouTube video"
      className="w-[100%] md:w-[600px] h-[340px]  "
    ></iframe>
    <Button onClick={() => setUrlPreview("")} style={{ marginTop: "10px" }}>
      Cancel
    </Button>
  </div>
);

export default VideoPreview;
