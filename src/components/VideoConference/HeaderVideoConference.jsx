import React, { useState } from 'react'
import { CiVideoOn } from "react-icons/ci"
import { Modal } from 'antd'
import VideoCall from './VideoCall'

function HeaderVideoConference() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [meetingStarted, setMeetingStarted] = useState(false)

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

    return (
        <>
            <div className="flex justify-end w-full p-4">
                <button
                    onClick={handleStartMeeting}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    <CiVideoOn className="text-xl" />
                </button>
            </div>

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={200}
                height={200}
                destroyOnClose
                modalRenderProps={{ draggable: true }}
                style={{
                    position: 'fixed',
                    top: 70,
                    right: 10,
                    margin: 0
                }}
            >
                <VideoCall />
            </Modal>
        </>
    )
}

export default HeaderVideoConference