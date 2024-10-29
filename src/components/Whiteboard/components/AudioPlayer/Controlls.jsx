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
    <div className="controls flex justify-center h-full p-2 pt-6 space-x-6 text-white">
    <button className="flex  justify-center text-3xl">
        <StepBackwardOutlined />
    </button>
    <button className="flex  justify-center text-3xl">
        <BackwardOutlined />
    </button>
    <button className="flex justify-center text-3xl">
        <LeftOutlined />
    </button>
    {play ? (
    <button className="flex justify-center text-3xl" onClick={()=>setPlay(!play)}>
        <CaretRightOutlined />
    </button>) :(
    <button className="flex justify-center text-3xl" onClick={()=>setPlay(!play)}>
        <PauseOutlined />
    </button>)
    }
    <button className="flex justify-center text-3xl">
        <RightOutlined />
    </button>
    <button className="flex  justify-center text-3xl">
        <StepForwardOutlined />
    </button>
    <button className="flex justify-center text-3xl">
        <SoundOutlined />
    </button>
</div>
  )
}

export default Controlls