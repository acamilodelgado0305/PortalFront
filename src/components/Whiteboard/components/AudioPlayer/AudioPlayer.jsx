import { SoundOutlined, CloseOutlined } from "@ant-design/icons";
function AudioPlayer({audioBar, name}) {
  return (
    <>
      {!audioBar && (
        <div className="absolute w-[210px] top-[50px] left-[50px] z-[1] overflow-hidden">
          <div className="flex items-center border border-gray backdrop-blur-[10px] rounded-[20px] p-[5px] cursor-pointer text-white bg-[#7066E0] z-[-1]">
          <SoundOutlined className="text-[16px]" />
            <span className="flex-1 text-center ml-[10px] font-bold text-white">
              {name.length > 14 ? `${name.substring(0, 14)}...` : name}
            </span>
            <button className="audio-close mr-2">
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AudioPlayer

