import {
  CloseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
function AudioClose({ name, audioBar, setAudioBar, onClose }) {
  return (
    <div className="absolute left-[10px]  md:left-[50px] top-[50px] z-[1] w-[210px] overflow-hidden">
      <div className="animate-audioClose border-gray z-[-1] flex cursor-pointer items-center rounded-[10px] border bg-[#7066E0] p-[5px] text-white backdrop-blur-[10px]">
        <PlayCircleOutlined className="pl-1 text-[18px] " />
        <span
          className="ml-[10px] flex-1 text-center font-bold text-[13px] text-white"
          onClick={() => {
            setAudioBar(!audioBar);
          }}
        >
          {name.length > 14 ? `${name.substring(0, 14)}...` : name}
        </span>
        <button
          className="audio-close z-[99] mr-2 flex items-center justify-center rounded bg-transparent p-2 transition duration-200"
          onClick={onClose}
        >
          <CloseOutlined
            onClick={onClose}
            className="text-white hover:text-gray-300"
          />
        </button>
      </div>
    </div>
  );
}

export default AudioClose;
