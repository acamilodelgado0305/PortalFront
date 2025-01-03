import { FloatButton } from "antd";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { TbMessage } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import VideoCall from "../../../VideoConference/VideoCall";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function BottomButtonsBar({ handleFloatButtonClick, handleImageButtonClick, goToNextPage, goToPreviousPage }) {
  const navigate = useNavigate();

  const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
  const shapeForm = "square" || "circle";
  const emitToSocket = true;
  const style = {
    width: '50px',
    height: '50px',
  }


  const handleVideoButtonClick = () => {
    setIsVideoCallVisible(!isVideoCallVisible);
  };

  const handleCloseVideoCall = () => {
    setIsVideoCallVisible(false);
  };


  return (
    <>
    <div className="flex justify-between items-center absolute w-full px-[1.4vw] bottom-[10vh]">
      <FloatButton
        className="static"
        shape={shapeForm}
        style={style}
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(-90deg)" }}
          />
        }
        onClick={() => goToPreviousPage(emitToSocket)}
      />
      <div className="flex gap-1">
        <FloatButton
          className="  static"
          shape={shapeForm}
          style={style}
          icon={<PlayCircleOutlined className="iconAudioFloat" />}
          onClick={handleFloatButtonClick}

        />
        <FloatButton
          className="  static"
          shape={shapeForm}
          style={style}
          icon={<FileImageOutlined className="iconImageFloat" />}
          onClick={handleImageButtonClick}
        />
        <FloatButton
          className="  static"
          shape={shapeForm}
          style={style}
          icon={<TbMessage className="iconImageFloat" />}
        />
        <FloatButton
          className="static"
          shape={shapeForm}
          style={style}
          icon={<CiVideoOn className="iconImageFloat" />}
          onClick={handleVideoButtonClick}
        />
      </div>
      <FloatButton
        className=" static"
        shape={shapeForm}
        style={style}
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(90deg)" }}
          />

        }
        onClick={() => goToNextPage(emitToSocket)}
      />   
    </div>
    <div className="absolute w-auto h-auto right-0 z-[88]">
    {isVideoCallVisible &&  <VideoCall
        onClose={handleCloseVideoCall}
      />}
</div>
    </>
  );
}

export default BottomButtonsBar;
