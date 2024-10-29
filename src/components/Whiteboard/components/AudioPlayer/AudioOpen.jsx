import React, { useEffect, useState } from 'react';
import Controlls from "./Controlls";
import { CloseOutlined } from "@ant-design/icons";
import ProgressBar from './ProgressBar';

function AudioOpen({ name, audioBar, setAudioBar, currentTime, duration, setCurrentTime }) {
    const [progressWidth, setProgressWidth] = useState(10);
    const [isDragging, setIsDragging] = useState(false);
    const progressRef = React.useRef(null); // Referencia para la barra de progreso

    useEffect(() => {
        if (duration > 0) {
            setProgressWidth((currentTime / duration) * 100);
        }
    }, [currentTime, duration]);

    const handleMouseDown = (event) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging && progressRef.current) {
            const { left, width } = progressRef.current.getBoundingClientRect();
            const mouseX = event.clientX - left;
            const newProgress = Math.max(0, Math.min(mouseX / width, 1)); // Limita el valor entre 0 y 1
            setProgressWidth(newProgress * 100);
            setCurrentTime(newProgress * duration); // Actualiza el tiempo actual
        }
    };

    return (
        <div
            className={
                'absolute w-[700px] h-[100px] border border-gray backdrop-blur-[30px] bg-[#7066E0] rounded-[20px] top-[50px] left-[50px] z-[1] overflow-hidden'
            }
            style={{
                top: window.innerHeight < 600 ? '23vh' : '',
                right: window.innerHeight < 600 && '50px'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Para parar el arrastre si el mouse sale de la barra
        >
            <CloseOutlined className="absolute top-2 right-2 text-white hover:text-gray transition duration-200" 
                onClick={() => {
                    setAudioBar(!audioBar); 
                }}
            />
            <Controlls />
            <ProgressBar progressRef={progressRef}  progressWidth={progressWidth}  handleMouseDown={handleMouseDown}  />
            
            
        </div>
    );
}

export default AudioOpen;



