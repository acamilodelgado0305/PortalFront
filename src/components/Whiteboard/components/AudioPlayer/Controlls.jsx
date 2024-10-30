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

function Controlls() {
  const [play, setPlay] = useState(false);
  
  return (
    <div className="controls flex justify-center h-full p-2 pt-6 space-x-6 ">
    <button className="flex  justify-center text-3xl text-white hover:text-[#8A82EB]">
        <StepBackwardOutlined />
    </button>
    <button className="flex  justify-center text-3xl text-white hover:text-[#8A82EB] ">
        <BackwardOutlined />
    </button>
    <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB]">
        <LeftOutlined />
    </button>
    {play ? (
    <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB]" onClick={()=>setPlay(!play)}>
        <CaretRightOutlined />
    </button>) :(
    <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB]" onClick={()=>setPlay(!play)}>
        <PauseOutlined />
    </button>)
    }
    <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB]">
        <RightOutlined />
    </button>
    <button className="flex  justify-center text-3xl text-white hover:text-[#8A82EB]">
        <StepForwardOutlined />
    </button>
    <button className="flex justify-center text-3xl text-white hover:text-[#8A82EB]">
        <SoundOutlined />
    </button>
</div>
  )
}

export default Controlls