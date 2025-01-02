import { FloatButton } from "antd";
import { PlayCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { TbMessage } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";

function BottomButtonsBar({handleFloatButtonClick, handleImageButtonClick, goToNextPage, goToPreviousPage}) {
  const shapeForm =  "square"||"circle"; 
  const emitToSocket = true;
  const style =   {
    width: '50px',
    height: '50px',
   }
  return (
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
        onClick={()=>goToPreviousPage(emitToSocket)}
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
      </div>
      <FloatButton
        className=" static"
        shape={shapeForm}
        style={style}
        icon={
          <BsTriangle
            className="iconImageFloat"
            style={{ transform: "rotate(90deg)"  }}
          />

        }
        onClick={()=>goToNextPage(emitToSocket)}
      />
    </div>
  );
}

export default BottomButtonsBar;
