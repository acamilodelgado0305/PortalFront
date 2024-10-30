import { useState } from "react";
import {
    StepBackwardOutlined,
    BackwardOutlined,
    LeftOutlined,
    CaretRightOutlined,
    PauseOutlined,
    RightOutlined,
    StepForwardOutlined,
    SoundOutlined,
} from "@ant-design/icons";
import './controlls.css'


function Controlls() {
  const [play, setPlay] = useState(true);
  const [volume, setVolume] = useState(false)
  
  return (
    <div className="controls flex justify-center h-full w-full pl-[20%] pt-6 space-x-6">
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <StepBackwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <BackwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <LeftOutlined />
      </button>
      {play ? (
        <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500" onClick={() => setPlay(!play)}>
          <CaretRightOutlined />
        </button>
      ) : (
        <button className="flex justify-center text-3xl text-white transition-all duration-500 animate-textChange" onClick={() => setPlay(!play)}>
        <PauseOutlined />
      </button>
      )}
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <RightOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500">
        <StepForwardOutlined />
      </button>
      <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB] transition-all duration-500" onClick={() => setVolume(!volume)}>
        <SoundOutlined />
      </button>
 
        {/* Barra de volumen */}
        <div className={`relative w-24 h-[3.5px] bg-gray-200 rounded mt-[15px] transition-opacity duration-500 ${volume ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className="absolute h-full bg-[#7066E0] rounded"
          style={{ width: `50%` }} // Ajusta el ancho según el nivel de volumen
        />
      </div>
    </div>
  );
}

export default Controlls;
