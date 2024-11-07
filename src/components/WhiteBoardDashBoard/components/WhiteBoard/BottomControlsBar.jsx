import { FloatButton } from "antd";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { TbMessage } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";

function BottomControlsBar({handleFloatButtonClick, handleImageButtonClick}) {
  return (
    <div className="flex justify-between items-center absolute w-full px-[5vw] bottom-[10vh]">
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(-90deg)" }}
          />
        }
      />
      <div className="flex gap-1">
      <FloatButton
        icon={<PlayCircleOutlined className="iconAudioFloat" />}
        onClick={handleFloatButtonClick}
        className="floatButtonAudio iconAudioFloat static"
      />
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        icon={<FileImageOutlined className="iconImageFloat" />}
        onClick={handleImageButtonClick}
      />
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        icon={<TbMessage className="iconImageFloat" />}
      />
      </div>
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(90deg)"  }}
          />
        }
      />
    </div>
  );
}

export default BottomControlsBar;
