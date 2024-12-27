import React, { useState, useEffect, useRef } from 'react';

if (typeof global === 'undefined') {
    window.global = window;
}
if (typeof process === 'undefined') {
    window.process = { env: {} };
}

import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';

const VideoCall = () => {
    const [meetingSession, setMeetingSession] = useState(null);
    const [localVideo, setLocalVideo] = useState(false);
    const [remoteVideos, setRemoteVideos] = useState([]);
    const [meetingId, setMeetingId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [meetingData, setMeetingData] = useState(null);
    const [audioConnected, setAudioConnected] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});

    const createMeeting = async () => {
        try {
            const response = await fetch('http://localhost:4005/api/chime/create-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ externalUserId: userEmail }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setMeetingData(data);
            setMeetingId(data.meeting.MeetingId);
            setIsHost(true);
            await initializeMeetingSession(data.meeting, data.attendee);
        } catch (err) {
            setError('Error al crear la reunión: ' + err.message);
        }
    };

    const joinMeeting = async () => {
        try {
            if (!meetingId.trim() || !userEmail.trim()) {
                throw new Error('El ID de la reunión y el correo electrónico son necesarios');
            }

            const joinResponse = await fetch('http://localhost:4005/api/chime/join-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meetingId: meetingId.trim(),
                    externalUserId: userEmail.trim(),
                }),
            });

            if (!joinResponse.ok) {
                const errorData = await joinResponse.json();
                throw new Error(errorData.error || 'Error al unirse a la reunión');
            }

            const joinData = await joinResponse.json();
            if (!joinData.meeting || !joinData.attendee) {
                throw new Error('No se recibió la información completa de la reunión');
            }

            await initializeMeetingSession(joinData.meeting, joinData.attendee);
        } catch (err) {
            setError(err.message);
        }
    };

    const initializeMeetingSession = async (meeting, attendee) => {
        try {
            const logger = new ConsoleLogger('MeetingLogs', LogLevel.INFO);
            const deviceController = new DefaultDeviceController(logger);

            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            const session = new DefaultMeetingSession(configuration, logger, deviceController);

            setMeetingSession(session);
            await startAudioVideo(session);
        } catch (err) {
            setError('Error al inicializar la sesión: ' + err.message);
        }
    };

    const startAudioVideo = async (session) => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }

            // Configurar audio
            const audioOutputDevices = await session.audioVideo.listAudioOutputDevices();
            if (audioOutputDevices.length > 0) {
                await session.audioVideo.chooseAudioOutput(audioOutputDevices[0].deviceId);
            }

            const audioInputDevices = await session.audioVideo.listAudioInputDevices();
            if (audioInputDevices.length > 0) {
                await session.audioVideo.startAudioInput(audioInputDevices[0].deviceId);
            }

            // Configurar video
            const videoInputDevices = await session.audioVideo.listVideoInputDevices();
            if (videoInputDevices.length > 0) {
                await session.audioVideo.startVideoInput(videoInputDevices[0].deviceId);
            }

            // Configurar observadores
            session.audioVideo.addObserver({
                audioVideoDidStart: () => {
                    setAudioConnected(true);
                },
                audioVideoDidStop: (sessionStatus) => {
                    setAudioConnected(false);
                },
                videoTileDidUpdate: (tileState) => {
                    if (!tileState.localTile) {
                        setRemoteVideos(prev => [...prev, tileState.tileId]);
                    }
                },
                videoTileWasRemoved: (tileId) => {
                    setRemoteVideos(prev => prev.filter(id => id !== tileId));
                },
                remoteVideoSourcesDidChange: (videoSources) => {
                    console.log('Remote video sources changed:', videoSources);
                }
            });

            await session.audioVideo.start();
            setLocalVideo(true);

        } catch (err) {
            setError('Error al iniciar audio/video: ' + err.message);
        }
    };

    useEffect(() => {
        if (!meetingSession || !localVideo || !localVideoRef.current) return;

        let videoTileId = null;

        const startLocalVideo = async () => {
            try {
                videoTileId = meetingSession.audioVideo.startLocalVideoTile();
                if (videoTileId) {
                    await meetingSession.audioVideo.bindVideoElement(
                        videoTileId,
                        localVideoRef.current
                    );
                    localVideoRef.current.style.transform = 'scaleX(-1)';
                }
            } catch (err) {
                console.error('Error starting local video:', err);
            }
        };

        startLocalVideo();

        return () => {
            if (videoTileId) {
                meetingSession.audioVideo.unbindVideoElement(videoTileId);
            }
        };
    }, [meetingSession, localVideo]);

    useEffect(() => {
        if (!meetingSession) return;

        remoteVideos.forEach(tileId => {
            if (remoteVideoRefs.current[tileId]) {
                meetingSession.audioVideo.bindVideoElement(
                    tileId,
                    remoteVideoRefs.current[tileId]
                );
            }
        });
    }, [meetingSession, remoteVideos]);

    useEffect(() => {
        return () => {
            if (meetingSession) {
                meetingSession.audioVideo.stop();
            }
        };
    }, [meetingSession]);

    return (
        <div className="p-4">
            <div className="mb-4 space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="p-2 border rounded mr-2 w-64"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                </div>

                {!isHost && (
                    <div>
                        <input
                            type="text"
                            placeholder="ID de la reunión"
                            className="p-2 border rounded mr-2 w-64"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                        />
                    </div>
                )}

                {!meetingSession && (
                    <div className="space-x-2">
                        <button
                            onClick={createMeeting}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Crear Reunión
                        </button>
                        <button
                            onClick={joinMeeting}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Unirse a Reunión
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {meetingId && isHost && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-medium">ID de la reunión (comparte este ID):</p>
                    <p className="font-mono bg-white p-2 rounded mt-1">{meetingId}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-4">
                {localVideo && (
                    <div className="w-64 h-48 bg-black rounded overflow-hidden relative">
                        <video
                            ref={localVideoRef}
                            className="w-full h-full object-cover transform -scale-x-100"
                            autoPlay
                            playsInline
                            muted
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            Tú
                        </div>
                    </div>
                )}
                {remoteVideos.map((tileId) => (
                    <div key={tileId} className="w-64 h-48 bg-black rounded overflow-hidden">
                        <video
                            ref={(el) => (remoteVideoRefs.current[tileId] = el)}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoCall;