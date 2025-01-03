import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Alert, Button } from 'antd';

// Configuración global necesaria para Chime SDK
if (typeof global === 'undefined') {
    window.global = window;
}

import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';

const VideoCall = ({ onClose }) => {
    const meetingId ='924e4f7b-eac6-4a80-a587-22b962442713'; 
    const [meetingSession, setMeetingSession] = useState(null);
    const [error, setError] = useState({ type: '', message: '' });
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasLocalVideo, setHasLocalVideo] = useState(false);
    const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Unirse a la reunión automáticamente al montar el componente
    useEffect(() => {
        joinMeeting();
    }, []);

    const joinMeeting = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                throw new Error('Usuario no encontrado en localStorage');
            }
            
            const user = JSON.parse(userData);
            if (!user.email) {
                throw new Error('Email de usuario no encontrado');
            }
            
            const externalUserId = user.email;

            console.log('Intentando unirse a la reunión...', { meetingId, externalUserId });

            const response = await fetch('https://back.app.esturio.com/api/chime/join-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meetingId: meetingId,
                    externalUserId: externalUserId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al unirse a la reunión');
            }

            // Mostrar mensaje de éxito
            console.log('Unión exitosa a la reunión:', data);
            setError(''); // Limpiar cualquier error previo
            
            // Mostrar mensaje de éxito temporal
            const successMessage = data.message || 'Te has unido exitosamente a la reunión';
            setError({ type: 'success', message: successMessage });
            
            await initializeMeetingSession(data.meeting, data.attendee);

        } catch (err) {
            console.error('Error al unirse a la reunión:', err);
            setError({ type: 'error', message: err.message });
        }
    };

    const initializeMeetingSession = async (meeting, attendee) => {
        try {
            console.log('Initializing meeting session with:', { meeting, attendee });
            
            const logger = new ConsoleLogger('ChimeLogger', LogLevel.INFO);
            const deviceController = new DefaultDeviceController(logger);
            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            
            const session = new DefaultMeetingSession(
                configuration,
                logger,
                deviceController
            );

            // Configurar observadores
            session.audioVideo.addObserver({
                // Video handlers
                videoTileDidUpdate: (tileState) => {
                    if (!tileState) return;
                    console.log('Video tile updated:', tileState);
                    
                    if (tileState.localTile) {
                        setHasLocalVideo(true);
                        if (localVideoRef.current) {
                            session.audioVideo.bindVideoElement(
                                tileState.tileId,
                                localVideoRef.current
                            );
                        }
                    } else {
                        setHasRemoteVideo(true);
                        if (remoteVideoRef.current) {
                            session.audioVideo.bindVideoElement(
                                tileState.tileId,
                                remoteVideoRef.current
                            );
                        }
                    }
                },

                // Audio handlers
                audioVideoDidStart: () => {
                    console.log('AudioVideo started');
                },
                audioVideoDidStop: (sessionStatus) => {
                    console.log('AudioVideo stopped:', sessionStatus);
                },

                // Remote audio specific handlers
                remoteAudioStarted: (attendeeId) => {
                    console.log('Remote audio started for:', attendeeId);
                },
                remoteAudioStopped: (attendeeId) => {
                    console.log('Remote audio stopped for:', attendeeId);
                },

                // Volume indicators
                volumeDidChange: (attendeeId, volume, muted, signalStrength) => {
                    console.log('Volume changed for:', attendeeId, {volume, muted, signalStrength});
                },

                // Connection quality
                connectionDidBecomePoor: () => {
                    console.log('Connection quality became poor');
                    setError({ type: 'warning', message: 'La calidad de conexión es baja' });
                },
                connectionDidSuggestStopVideo: () => {
                    console.log('Poor connection: suggesting stop video');
                    setError({ type: 'warning', message: 'Conexión débil: considera apagar el video' });
                },

                // Audio mixing
                audioIsLocallyMuted: (muted) => {
                    console.log('Local audio muted:', muted);
                    setIsAudioMuted(muted);
                },
            });

            setMeetingSession(session);
            await startAudioVideo(session);

        } catch (err) {
            console.error('Error initializing session:', err);
            setError({ type: 'error', message: 'Error al inicializar la sesión: ' + err.message });
        }
    };

    const startAudioVideo = async (session) => {
        try {
            // Iniciar la sesión primero
            await session.audioVideo.start();
            console.log('Session started successfully');

            // Iniciar audio
            try {
                const audioInputDevices = await session.audioVideo.listAudioInputDevices();
                console.log('Audio devices:', audioInputDevices);
                
                if (audioInputDevices && audioInputDevices.length > 0) {
                    const audioDevice = audioInputDevices[0];
                    if (audioDevice && audioDevice.deviceId) {
                        await session.audioVideo.startAudioInput(audioDevice.deviceId);
                        console.log('Audio started with device:', audioDevice.deviceId);
                    }
                }
            } catch (audioError) {
                console.error('Error starting audio:', audioError);
            }

            // Iniciar video
            try {
                const videoInputDevices = await session.audioVideo.listVideoInputDevices();
                console.log('Video devices:', videoInputDevices);
                
                if (videoInputDevices && videoInputDevices.length > 0) {
                    const videoDevice = videoInputDevices[0];
                    if (videoDevice && videoDevice.deviceId) {
                        await session.audioVideo.startVideoInput(videoDevice.deviceId);
                        console.log('Video input started');
                        
                        // Iniciar el tile de video local
                        session.audioVideo.startLocalVideoTile();
                        console.log('Local video tile started');
                    }
                }
            } catch (videoError) {
                console.error('Error starting video:', videoError);
            }

        } catch (err) {
            console.error('Error starting devices:', err);
            setError('Error al iniciar dispositivos: ' + err.message);
        }
    };

    const toggleAudio = async () => {
        if (meetingSession) {
            try {
                if (isAudioMuted) {
                    await meetingSession.audioVideo.unmute();
                } else {
                    await meetingSession.audioVideo.mute();
                }
                setIsAudioMuted(!isAudioMuted);
            } catch (err) {
                setError('Error al cambiar el estado del audio');
            }
        }
    };

    const toggleVideo = async () => {
        if (meetingSession) {
            try {
                if (isVideoOff) {
                    const devices = await meetingSession.audioVideo.listVideoInputDevices();
                    await meetingSession.audioVideo.startVideoInput(devices[0].deviceId);
                    meetingSession.audioVideo.startLocalVideoTile();
                } else {
                    await meetingSession.audioVideo.stopVideoInput();
                    meetingSession.audioVideo.stopLocalVideoTile();
                }
                setIsVideoOff(!isVideoOff);
            } catch (err) {
                setError('Error al cambiar el estado del video');
            }
        }
    };

    const handleClose = () => {
        if (meetingSession) {
            meetingSession.audioVideo.stop();
        }
        onClose();
    };

    useEffect(() => {
        return () => {
            if (meetingSession) {
                meetingSession.audioVideo.stop();
            }
        };
    }, [meetingSession]);

    return (
        <div className="fixed top-0 right-0 bg-white p-4 shadow-lg rounded-lg w-96">
            {error.message && (
                <Alert
                    message={error.type === 'success' ? 'Éxito' : 'Error'}
                    description={error.message}
                    type={error.type === 'success' ? 'success' : 'error'}
                    showIcon
                    className="mb-4"
                    closable
                    onClose={() => setError({ type: '', message: '' })}
                />
            )}

            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Video Call</h2>
                    <Button type="text" onClick={handleClose}>
                        ✕
                    </Button>
                </div>

                <div className="space-y-4">
                    {/* Contenedor de videos */}
                    <div className="flex space-x-2">
                        {/* Video local */}
                        <div className="w-1/2">
                            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                                <video
                                    ref={localVideoRef}
                                    className="w-full h-full object-cover transform -scale-x-100"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                    Tú
                                </div>
                            </div>
                        </div>

                        {/* Video remoto */}
                        <div className="w-1/2">
                            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                                <video
                                    ref={remoteVideoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    playsInline
                                />
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                    Participante
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="flex justify-center space-x-4">
                        <Button
                            type="primary"
                            danger={isVideoOff}
                            shape="circle"
                            icon={isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                            onClick={toggleVideo}
                        />
                        <Button
                            type="primary"
                            danger={isAudioMuted}
                            shape="circle"
                            icon={isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            onClick={toggleAudio}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;