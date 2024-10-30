import React, { useEffect, useState } from 'react';
import Controlls from "./Controlls";
import { CloseOutlined } from "@ant-design/icons";
import ProgressBar from './ProgressBar';

function AudioOpen({ name, audioBar, setAudioBar, currentTime, duration, setCurrentTime }) {
 

    return (
        <div
            className={
                'absolute w-[700px] h-[100px] border-2 border-[#7066E0] backdrop-blur-[10px] bg-[#7066E0]/50 rounded-[20px] top-[50px] left-[50px] z-[1] overflow-hidden'
            }
            style={{
                top: window.innerHeight < 600 ? '23vh' : '',
                right: window.innerHeight < 600 && '50px'
            }}
        >
            <CloseOutlined className="absolute top-2 right-2 text-white hover:text-gray transition duration-200" 
                onClick={() => {
                    setAudioBar(!audioBar); 
                }}
            />
            <Controlls />
            <ProgressBar currentTime={currentTime} duration={duration} setCurrentTime={setCurrentTime} />
            
            
        </div>
    );
}

export default AudioOpen;



