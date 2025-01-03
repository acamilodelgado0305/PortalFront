import React, { useState } from 'react'
import { CiVideoOn } from "react-icons/ci"
import { Modal } from 'antd'
import VideoCall from './VideoCall'
import { FloatButton } from "antd";

function HeaderVideoConference() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [meetingStarted, setMeetingStarted] = useState(false)
    const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);


    const handleStartMeeting = async () => {
        try {
            const userEmail = JSON.parse(localStorage.getItem('user')).email
            const response = await fetch('https://back.app.esturio.com/api/chime/create-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ externalUserId: userEmail })
            })

            if (response.ok) {
                setIsModalOpen(true)
                setMeetingStarted(true)
            }
        } catch (error) {
            console.error('Error al crear reunión:', error)
        }
    }


   

    
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
                />}
            </div>
        </>
    )
}

export default HeaderVideoConference