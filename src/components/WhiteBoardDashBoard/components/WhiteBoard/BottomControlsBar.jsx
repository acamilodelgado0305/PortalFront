import { FloatButton } from "antd";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { TbMessage } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";

function BottomControlsBar({handleFloatButtonClick, handleImageButtonClick}) {
  const shapeForm =  "square"||"circle"; 
  return (
    <div className="flex justify-between items-center absolute w-full px-[5vw] bottom-[10vh]">
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        shape={shapeForm}
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(-90deg)" }}
          />
        }
      />
      <div className="flex gap-1">
      <FloatButton
        className="floatButtonAudio iconAudioFloat static"
        shape={shapeForm}
        icon={<PlayCircleOutlined className="iconAudioFloat" />}
        onClick={handleFloatButtonClick}
       
      />
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        shape={shapeForm}
        icon={<FileImageOutlined className="iconImageFloat" />}
        onClick={handleImageButtonClick}
      />
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        shape={shapeForm}
        icon={<TbMessage className="iconImageFloat" />}
      />
      </div>
      <FloatButton
        className="floatButtonImage iconImageFloat static"
        shape={shapeForm}
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
