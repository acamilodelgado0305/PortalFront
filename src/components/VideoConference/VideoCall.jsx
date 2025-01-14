import React, { useState, useEffect, useRef } from 'react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';
import { HiPhoneXMark } from 'react-icons/hi2';


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
    const meetingId = '3e40919c-c722-4651-bd94-a809fe872713'; // ID de la reunión
    const [externalUserId, setExternalUserId] = useState(null);
    const [meetingSession, setMeetingSession] = useState(null);
    const [localVideo, setLocalVideo] = useState(false);
    const [remoteVideos, setRemoteVideos] = useState([]);
    const [error, setError] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [audioInputDevice, setAudioInputDevice] = useState(null);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const audioAnalyzerInterval = useRef(null);
    const [remoteAudioLevel, setRemoteAudioLevel] = useState({});
    const remoteAudioAnalyzerInterval = useRef(null);
    const audioElementRef = useRef(null);
    const audioContextRef = useRef(null);

    // Unirse a la reunión automáticamente al montar el componente
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.email) {
                setExternalUserId(user.email); // Guardar el externalUserId en el estado
            } else {
                setError('Email de usuario no encontrado');
            }
        } else {
            setError('Usuario no encontrado en localStorage');
        }

    }, []);

    useEffect(() => {
        const joinMeeting = async () => {
            try {
                if (!externalUserId) {
                    throw new Error('El usuario externo es necesario');
                }

                if (!meetingId?.trim()) {
                    throw new Error('El ID de la reunión es necesario');
                }

                const joinResponse = await fetch('http://localhost:4005/api/chime/join-meeting', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        meetingId: meetingId.trim(),
                        externalUserId: externalUserId.trim(),
                    }),
                });

                if (!joinResponse.ok) {
                    const errorData = await joinResponse.json();
                    throw new Error(errorData.error || 'Error al unirse a la reunión');
                }

                const joinData = await joinResponse.json();
                console.log('Joined meeting:', joinData);

                if (!joinData.meeting || !joinData.attendee) {
                    throw new Error('No se recibió la información completa de la reunión');
                }

                await initializeMeetingSession(joinData.meeting, joinData.attendee);

            } catch (err) {
                console.error('Error al unirse a la reunión:', err);
                setError(err.message);
            }
        };

        if (externalUserId && meetingId) {
            joinMeeting();
        }

    }, [externalUserId, meetingId]);

    const toggleCamera = async () => {
        if (!meetingSession) return;
        try {
            if (isCameraOff) {
                const devices = await meetingSession.audioVideo.listVideoInputDevices();
                await meetingSession.audioVideo.startVideoInput(devices[0].deviceId);
                setLocalVideo(true);
            } else {
                await meetingSession.audioVideo.stopVideoInput();
                setLocalVideo(false);
            }
            setIsCameraOff(!isCameraOff);
        } catch (err) {
            setError('Error con la cámara: ' + err.message);
        }
    };

    const initializeMeetingSession = async (meeting, attendee) => {
        try {
            const logger = new ConsoleLogger('MeetingLogs', LogLevel.INFO);
            const deviceController = new DefaultDeviceController(logger);

            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            const session = new DefaultMeetingSession(configuration, logger, deviceController);

            // Mejorar la configuración inicial del elemento de audio
            const audioElement = document.createElement('audio');
            audioElement.style.display = 'none';
            audioElement.volume = 1.0; // Asegurar volumen máximo
            document.body.appendChild(audioElement);
            audioElementRef.current = audioElement;

            try {
                await session.audioVideo.bindAudioElement(audioElement);
                console.log('Audio element bound successfully');
            } catch (e) {
                console.error('Error binding audio element:', e);
                setError('Error al vincular elemento de audio: ' + e.message);
            }

            session.audioVideo.addObserver({
                // Mejorar el manejo inicial del audio
                audioVideoDidStart: async () => {
                    console.log('AudioVideo started');
                    try {
                        // Verificar y configurar dispositivo de entrada de audio
                        const audioInputDevices = await session.audioVideo.listAudioInputDevices();
                        console.log('Available audio input devices:', audioInputDevices);

                        if (audioInputDevices.length === 0) {
                            throw new Error('No se detectaron dispositivos de entrada de audio');
                        }

                        // Iniciar el audio de entrada
                        try {
                            const defaultDevice = audioInputDevices[0].deviceId;
                            await session.audioVideo.startAudioInput(defaultDevice);
                            console.log('Audio input started with device:', defaultDevice);
                        } catch (e) {
                            console.error('Failed to start audio input:', e);
                            setError('Error al iniciar entrada de audio: ' + e.message);
                        }

                        // Configurar dispositivo de salida de audio
                        const audioOutputDevices = await session.audioVideo.listAudioOutputDevices();
                        console.log('Available audio output devices:', audioOutputDevices);

                        if (audioOutputDevices.length > 0) {
                            try {
                                await session.audioVideo.chooseAudioOutput(audioOutputDevices[0].deviceId);
                                console.log('Audio output configured successfully');
                            } catch (e) {
                                console.error('Failed to configure audio output:', e);
                                setError('Error al configurar salida de audio: ' + e.message);
                            }
                        }
                    } catch (err) {
                        console.error('Error in audioVideoDidStart:', err);
                        setError('Error al inicializar dispositivos de audio: ' + err.message);
                    }
                },



                // Mejorar el manejo de eventos de audio
                audioInputDidStart: () => {
                    console.log('Audio input started successfully');
                    setError(''); // Limpiar errores previos si todo está bien
                },

                audioInputDidStop: () => {
                    console.log('Audio input stopped');
                    setError('El audio de entrada se ha detenido');
                },

                audioVideoDidStop: (sessionStatus) => {
                    console.log('AudioVideo stopped with status:', sessionStatus);
                    if (sessionStatus.statusCode() !== 0) {
                        setError(`La sesión de audio/video se detuvo: ${sessionStatus.statusCode()}`);
                    }
                },


                attendeeDidJoin: (attendeeId) => {
                    console.log('Attendee joined:', attendeeId);
                    // Comenzar a monitorear el audio del nuevo participante
                    meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                        attendeeId,
                        (id, volume, muted, signalStrength) => {
                            if (id !== meetingSession.configuration.credentials.attendeeId) {
                                setRemoteAudioLevel(prev => ({
                                    ...prev,
                                    [id]: {
                                        volume: Math.round(volume * 100),
                                        muted,
                                        signalStrength
                                    }
                                }));
                            }
                        }
                    );
                },

                attendeeDidLeave: (attendeeId) => {
                    console.log('Attendee left:', attendeeId);
                    // Eliminar el monitoreo del participante que se fue
                    setRemoteAudioLevel(prev => {
                        const newState = { ...prev };
                        delete newState[attendeeId];
                        return newState;
                    });
                },

                videoTileDidUpdate: tileState => {
                    console.log('Video tile updated:', tileState);
                    if (!tileState.boundAttendeeId) {
                        return;
                    }

                    const selfAttendeeId = session.configuration.credentials.attendeeId;

                    if (tileState.localTile) {
                        // Manejar video local
                        setLocalVideo(true);
                        if (localVideoRef.current) {
                            session.audioVideo.bindVideoElement(
                                tileState.tileId,
                                localVideoRef.current
                            );
                        }
                    } else {
                        // Manejar video remoto
                        console.log('Remote video tile updated:', tileState);
                        setRemoteVideos(prev => {
                            if (!prev.includes(tileState.tileId)) {
                                return [...prev, tileState.tileId];
                            }
                            return prev;
                        });
                    }
                },

                videoTileWasRemoved: (tileId) => {
                    console.log('Video tile removed:', tileId);
                    setRemoteVideos(prev => prev.filter(id => id !== tileId));
                    if (remoteVideoRefs.current[tileId]) {
                        session.audioVideo.unbindVideoElement(tileId);
                        delete remoteVideoRefs.current[tileId];
                    }
                },






            });

            setMeetingSession(session);
            await startAudioVideo(session);

            // Iniciar el audio/video con manejo de errores mejorado
            try {
                await startAudioVideo(session);
                console.log('AudioVideo started successfully');
            } catch (e) {
                console.error('Failed to start AudioVideo:', e);
                setError('Error al iniciar audio/video: ' + e.message);
            }

        } catch (err) {
            console.error('Session initialization error:', err);
            setError('Error al inicializar la sesión: ' + err.message);
        }
    };

    const handleClose = async () => {
        try {
            if (meetingSession) {
                const response = await fetch(`https://back.app.esturio.com/api/chime/meetings/${meetingId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requesterId: externalUserId })
                });

                if (!response.ok) throw new Error('Error al finalizar la reunión');

                meetingSession.audioVideo.stop();
                // Cierra el modal o finaliza la videollamada
            }
        } catch (err) {
            setError('Error al cerrar la reunión: ' + err.message);
        }
    };



    const startRemoteAudioMonitoring = () => {
        if (remoteAudioAnalyzerInterval.current) {
            clearInterval(remoteAudioAnalyzerInterval.current);
        }

        remoteAudioAnalyzerInterval.current = setInterval(() => {
            if (meetingSession) {
                // En lugar de obtener los asistentes con realtimeGetAttendeeIdPresence,
                // simplemente monitoreamos el audio de los participantes remotos
                const attendeeId = meetingSession.configuration.credentials.attendeeId;

                // Suscribirse al indicador de volumen para el asistente remoto
                meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                    attendeeId,
                    (id, volume, muted, signalStrength) => {
                        if (id !== attendeeId) { // Solo monitoreamos participantes remotos
                            setRemoteAudioLevel(prev => ({
                                ...prev,
                                [id]: {
                                    volume: Math.round(volume * 100),
                                    muted,
                                    signalStrength
                                }
                            }));
                        }
                    }
                );
            }
        }, 200);
    };


    const toggleMute = async () => {
        if (!meetingSession) return;

        try {
            if (isMuted) {
                // Reactivar el audio usando realtimeUnmuteLocalAudio()
                meetingSession.audioVideo.realtimeUnmuteLocalAudio();
                console.log('Micrófono activado');
            } else {
                // Silenciar el audio usando realtimeMuteLocalAudio()
                meetingSession.audioVideo.realtimeMuteLocalAudio();
                console.log('Micrófono silenciado');
            }
            setIsMuted(!isMuted);
        } catch (err) {
            console.error('Error al cambiar el estado del audio:', err);
            setError('Error al cambiar el estado del micrófono: ' + err.message);
        }
    };


    // Función para verificar el estado del audio
    const checkAudioStatus = async () => {
        if (!meetingSession) return;

        try {
            const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();
            const audioOutputDevices = await meetingSession.audioVideo.listAudioOutputDevices();

            if (audioInputDevices.length === 0) {
                setError('No se detectó micrófono. Por favor, conecte un micrófono.');
                return;
            }

            if (audioOutputDevices.length === 0) {
                setError('No se detectaron altavoces. Por favor, conecte altavoces o auriculares.');
                return;
            }

            console.log('Audio status checked: All devices available');
        } catch (err) {
            console.error('Error checking audio status:', err);
            setError('Error al verificar el estado del audio: ' + err.message);
        }
    };

    // Efecto para verificar periódicamente el estado del audio
    useEffect(() => {
        if (meetingSession) {
            const audioCheckInterval = setInterval(checkAudioStatus, 30000); // Verificar cada 30 segundos

            return () => clearInterval(audioCheckInterval);
        }
    }, [meetingSession]);





    const startAudioVideo = async (session) => {
        try {
            // Iniciar audio primero
            const audioInputDevices = await session.audioVideo.listAudioInputDevices();
            if (audioInputDevices.length > 0) {
                await session.audioVideo.startAudioInput(audioInputDevices[0].deviceId);
            }

            // Iniciar audio output (altavoces)
            const audioOutputDevices = await session.audioVideo.listAudioOutputDevices();
            if (audioOutputDevices.length > 0) {
                await session.audioVideo.chooseAudioOutput(audioOutputDevices[0].deviceId);
            }

            await session.audioVideo.start();
            session.audioVideo.realtimeSubscribeToVolumeIndicator(
                session.configuration.credentials.attendeeId,
                (attendeeId, volume) => {
                    if (!isMuted) {
                        setAudioLevel(Math.round(volume * 100));
                    }
                }
            );

            // Video después del audio
            const videoInputDevices = await session.audioVideo.listVideoInputDevices();
            if (videoInputDevices.length > 0 && !isCameraOff) { // Añadido check para isCameraOff
                await session.audioVideo.startVideoInput(videoInputDevices[0].deviceId);
                setLocalVideo(true);
            }
        } catch (err) {
            console.error('StartAudioVideo error:', err);
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



    useEffect(() => {
        if (!meetingSession) return;

        remoteVideos.forEach(tileId => {
            if (remoteVideoRefs.current[tileId] && !remoteVideoRefs.current[tileId].srcObject) {
                console.log('Binding remote video element for tile:', tileId);
                try {
                    meetingSession.audioVideo.bindVideoElement(
                        tileId,
                        remoteVideoRefs.current[tileId]
                    );
                } catch (err) {
                    console.error('Error binding remote video:', err);
                }
            }
        });
    }, [meetingSession, remoteVideos]);

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
            if (audioElementRef.current) {
                audioElementRef.current.remove();
            }
            // Limpiar contexto de audio si existe
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [meetingSession]);
    // Limpiar el intervalo del analizador de audio al desmontar
    useEffect(() => {
        return () => {
            if (audioAnalyzerInterval.current) {
                clearInterval(audioAnalyzerInterval.current);
            }
        };
    }, []);


    useEffect(() => {
        if (meetingSession) {
            startRemoteAudioMonitoring();
        }

        return () => {
            if (remoteAudioAnalyzerInterval.current) {
                clearInterval(remoteAudioAnalyzerInterval.current);
            }
        };
    }, [meetingSession]);



    useEffect(() => {
        if (meetingSession) {
            startRemoteAudioMonitoring();
        }

        return () => {
            if (remoteAudioAnalyzerInterval.current) {
                clearInterval(remoteAudioAnalyzerInterval.current);
            }
        };
    }, [meetingSession]);




    return (
        <div className="p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}


            <div className="flex flex-col gap-4 w-72">
                {localVideo && (
                    <div className="w-full h-48 bg-black rounded overflow-hidden relative">
                        <video
                            ref={localVideoRef}
                            className="w-full h-full object-cover transform -scale-x-100"
                            autoPlay
                            playsInline
                            muted
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            Anfitrión
                        </div>
                    </div>
                )}

                {remoteVideos.map((tileId) => (
                    <div key={tileId} className="w-full h-48 bg-black rounded overflow-hidden relative">
                        <video
                            ref={el => {
                                if (el) {
                                    remoteVideoRefs.current[tileId] = el;
                                    // Intentar vincular el elemento si el meetingSession existe
                                    if (meetingSession) {
                                        meetingSession.audioVideo.bindVideoElement(tileId, el);
                                    }
                                }
                            }}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            Asistente
                        </div>
                        {Object.entries(remoteAudioLevel).slice(0, 1).map(([attendeeId, data]) => (
                            <div key={attendeeId} className="absolute bottom-2 right-2 flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-200"
                                        style={{ width: `${data.volume}%` }}
                                    />
                                </div>
                                {data.muted && (
                                    <span className="text-red-500 text-xs">Muteado</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="fixed bottom-[4em] left-1/2 transform -translate-x-1/2 flex gap-4">
                    <button
                        onClick={handleClose}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                        <HiPhoneXMark className="text-xl" />
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`${isCameraOff ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80 text-white p-2 rounded-full`}
                    >
                        {isCameraOff ? <FiVideoOff className="text-xl" /> : <FiVideo className="text-xl" />}
                    </button>

                    <button
                        onClick={toggleMute}
                        className={`${isMuted ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80 text-white p-2 rounded-full`}
                    >
                        {isMuted ? <FiMicOff className="text-xl" /> : <FiMic className="text-xl" />}
                    </button>
                </div>



            </div>

            {/* Indicadores de audio remoto - solo para el asistente */}
            {Object.entries(remoteAudioLevel).length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-semibold mb-2">Audio Remoto</h3>
                    {Object.entries(remoteAudioLevel).slice(0, 1).map(([attendeeId, data]) => (
                        <div key={attendeeId} className="flex items-center space-x-4 mb-2">
                            <span className="text-sm">Asistente</span>
                            <div className="w-48 h-4 bg-gray-200 rounded overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-200"
                                    style={{ width: `${data.volume}%` }}
                                />
                            </div>
                            <span className="text-sm">{data.volume}%</span>
                            {data.muted && (
                                <span className="text-red-500 text-sm">Muteado</span>
                            )}
                            <span className="text-sm">
                                Señal: {data.signalStrength * 100}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoCall;