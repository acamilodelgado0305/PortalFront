import React, { useState, useEffect, useRef } from 'react';

// Definición de global para el SDK de Chime
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

    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});

    // Función para crear una reunión
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

            console.log('Meeting created:', data);
            setMeetingData(data);
            setMeetingId(data.meeting.MeetingId);
            setIsHost(true);
            await initializeMeetingSession(data.meeting, data.attendee);
        } catch (err) {
            console.error('Error details:', err);
            setError('Error al crear la reunión: ' + err.message);
        }
    };

    // Función para unirse a una reunión
    const joinMeeting = async () => {
        try {
            // Validaciones iniciales
            if (!meetingId.trim()) {
                throw new Error('El ID de la reunión es necesario');
            }

            if (!userEmail.trim()) {
                throw new Error('El correo electrónico es necesario');
            }

            // Unirse directamente a la reunión
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
            console.log('Joined meeting:', joinData);

            // Verificar que tenemos toda la información necesaria
            if (!joinData.meeting || !joinData.attendee) {
                throw new Error('No se recibió la información completa de la reunión');
            }

            // Inicializar la sesión con los datos recibidos
            await initializeMeetingSession(joinData.meeting, joinData.attendee);

        } catch (err) {
            console.error('Error al unirse a la reunión:', err);
            setError(err.message);
        }
    };

    // Inicializar la sesión de la reunión
    const initializeMeetingSession = async (meeting, attendee) => {
        try {
            const logger = new ConsoleLogger('MeetingLogs', LogLevel.INFO);
            const deviceController = new DefaultDeviceController(logger);

            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            const session = new DefaultMeetingSession(configuration, logger, deviceController);

            setMeetingSession(session);

            // Iniciar el audio y video
            await startAudioVideo(session);
        } catch (err) {
            console.error('Session initialization error:', err);
            setError('Error al inicializar la sesión: ' + err.message);
        }
    };

    // Iniciar audio y video
    const startAudioVideo = async (session) => {
        try {
            // Solicitar permisos de media primero
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: true
            });

            // Asegurarse de que tenemos una pista de video activa
            const videoTrack = mediaStream.getVideoTracks()[0];
            if (!videoTrack) {
                throw new Error('No se pudo obtener la pista de video');
            }

            // Mostrar vista previa del video local
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }

            const videoInputDevices = await session.audioVideo.listVideoInputDevices();
            if (videoInputDevices.length > 0) {
                await session.audioVideo.startVideoInput(videoInputDevices[0].deviceId);
            }

            const audioInputDevices = await session.audioVideo.listAudioInputDevices();
            if (audioInputDevices.length > 0) {
                await session.audioVideo.startAudioInput(audioInputDevices[0].deviceId);
            }

            await session.audioVideo.start();
            setLocalVideo(true);

            // Configurar observadores de video
            session.audioVideo.addObserver({
                videoTileDidUpdate: (tileState) => {
                    if (!tileState.localTile) {
                        setRemoteVideos(prev => [...prev, tileState.tileId]);
                    }
                },
                videoTileWasRemoved: (tileId) => {
                    setRemoteVideos(prev => prev.filter(id => id !== tileId));
                }
            });

        } catch (err) {
            console.error('StartAudioVideo error:', err);
            setError('Error al iniciar audio/video: ' + err.message);
        }
    };

    // Efecto para manejar el video local
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

                    // Forzar actualización del elemento de video
                    localVideoRef.current.style.transform = 'scaleX(-1)';
                }
            } catch (err) {
                console.error('Error starting local video:', err);
            }
        };

        startLocalVideo();

        return () => {
            if (videoTileId) {
                try {
                    meetingSession.audioVideo.unbindVideoElement(videoTileId);
                } catch (err) {
                    console.error('Error unbinding video:', err);
                }
            }
        };
    }, [meetingSession, localVideo]);

    // Efecto para manejar videos remotos
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

    // Limpiar al desmontar
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