import React, { useState, useEffect } from 'react';
import { CiVideoOn } from "react-icons/ci";
import { Modal } from 'antd';
import VideoCall from './VideoCall';
import { FloatButton } from "antd";
import { useLocation } from 'react-router-dom';

function HeaderVideoConference() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meetingStarted, setMeetingStarted] = useState(false);
    const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
    const [classInfo, setClassInfo] = useState(null);
    const [meetingId, setMeetingId] = useState(null); 
    const location = useLocation();

    useEffect(() => {
        const getClassInfo = async () => {
            try {
                const pathSegments = location.pathname.split('/');
                const whiteboardId = pathSegments[pathSegments.length - 1];
                
                const response = await fetch(`https://back.app.esturio.com/api/clases/${whiteboardId}`);
                if (response.ok) {
                    const data = await response.json();
                    setClassInfo(data);
                    // Guardamos el meetingId en el estado
                    setMeetingId(data.data.meetingId);
                }
            } catch (error) {
                console.error('Error al obtener información de la clase:', error);
            }
        };
    
        getClassInfo();
    }, [location]);



    const handleVideoButtonClick = () => {
        setIsVideoCallVisible(!isVideoCallVisible);
    };

    const handleCloseVideoCall = () => {
        setIsVideoCallVisible(false);
    };

    return (
        <>
            <div className="flex justify-end w-full p-4">
                <FloatButton
                    className="static"
                    icon={<CiVideoOn className="iconImageFloat" />}
                    onClick={handleVideoButtonClick}
                />
            </div>

            <div className="absolute w-auto h-auto right-0 z-[88]">
                {isVideoCallVisible && <VideoCall
                    onClose={handleCloseVideoCall}
                    meetingId={meetingId} 
                />}
            </div>
        </>
    );
}

export default HeaderVideoConference;