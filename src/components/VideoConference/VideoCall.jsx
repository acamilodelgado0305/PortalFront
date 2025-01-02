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

const VideoCall = ({visible}) => {
    const [meetingSession, setMeetingSession] = useState(null);
    const [localVideo, setLocalVideo] = useState(false);
    const [remoteVideos, setRemoteVideos] = useState([]);
    const [meetingId, setMeetingId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [meetingData, setMeetingData] = useState(null);

    const [audioLevel, setAudioLevel] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isTestingAudio, setIsTestingAudio] = useState(false);
    const [audioInputDevice, setAudioInputDevice] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const audioAnalyzerInterval = useRef(null);
    const [remoteAudioLevel, setRemoteAudioLevel] = useState({});
    const remoteAudioAnalyzerInterval = useRef(null);

    // Función para crear una reunión
    const createMeeting = async () => {
        try {
            const response = await fetch('https://back.app.esturio.com/api/chime/create-meeting', {
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


    const testAudio = async () => {
        if (!meetingSession) return;

        try {
            setIsTestingAudio(true);

            // Obtener lista de dispositivos de audio
            const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();

            if (audioInputs.length === 0) {
                throw new Error('No se encontraron dispositivos de audio');
            }

            // Seleccionar el primer dispositivo de audio
            const selectedDevice = audioInputs[0];
            setAudioInputDevice(selectedDevice);

            // Iniciar el audio input
            await meetingSession.audioVideo.startAudioInput(selectedDevice.deviceId);

            // Configurar el observador de métricas de audio
            meetingSession.audioVideo.addObserver({
                metricsDidReceive: (metrics) => {
                    if (metrics.audioInputLevel !== null) {
                        const level = Math.min(Math.floor(metrics.audioInputLevel * 100), 100);
                        setAudioLevel(level);
                    }
                }
            });

            // Iniciar el analizador de audio
            startAudioAnalyzer();

        } catch (err) {
            console.error('Error al probar el audio:', err);
            setError('Error al probar el audio: ' + err.message);
            setIsTestingAudio(false);
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
            const joinResponse = await fetch('https://back.app.esturio.com/api/chime/join-meeting', {
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

            // Configurar observador de audio remoto
            session.audioVideo.addObserver({
                // Mantener observadores existentes
                videoTileDidUpdate: (tileState) => {
                    if (!tileState.localTile) {
                        setRemoteVideos(prev => [...prev, tileState.tileId]);
                    }
                },
                videoTileWasRemoved: (tileId) => {
                    setRemoteVideos(prev => prev.filter(id => id !== tileId));
                },

                // Añadir observadores de audio remoto
                remoteVideoSourcesDidChange: (videoSources) => {
                    console.log('Remote video sources changed:', videoSources);
                },

                // Manejar cambios en el volumen remoto
                volumeDidChange: (attendeeId, volume, muted, signalStrength) => {
                    if (attendeeId !== session.configuration.credentials.attendeeId) {
                        setRemoteAudioLevel(prev => ({
                            ...prev,
                            [attendeeId]: {
                                volume: Math.round(volume * 100),
                                muted,
                                signalStrength
                            }
                        }));
                    }
                },

                // Manejar eventos de audio
                audioVideoDidStart: () => {
                    console.log('AudioVideo started');
                    session.audioVideo.startLocalAudioInput(audioInputDevice?.deviceId);
                },
                audioVideoDidStop: (sessionStatus) => {
                    console.log('Audio and video stopped:', sessionStatus);
                },
                connectionDidBecomePoor: () => {
                    console.log('Connection quality became poor');
                },
                connectionDidSuggestStopVideo: () => {
                    console.log('Connection quality suggests stopping video');
                },
                audioInputFailed: (e) => {
                    console.error('Audio input failed:', e);
                }
            });

            setMeetingSession(session);

            // Iniciar el audio y video
            await startAudioVideo(session);

            // Configurar audio remoto
            session.audioVideo.realtimeSubscribeToVolumeIndicator(
                attendee.AttendeeId,
                (attendeeId, volume, muted, signalStrength) => {
                    if (attendeeId !== attendee.AttendeeId) {
                        setRemoteAudioLevel(prev => ({
                            ...prev,
                            [attendeeId]: {
                                volume: Math.round(volume * 100),
                                muted,
                                signalStrength
                            }
                        }));
                    }
                }
            );

        } catch (err) {
            console.error('Session initialization error:', err);
            setError('Error al inicializar la sesión: ' + err.message);
        }
    };

    // Función para iniciar el analizador de audio
    const startAudioAnalyzer = () => {
        if (audioAnalyzerInterval.current) {
            clearInterval(audioAnalyzerInterval.current);
        }

        audioAnalyzerInterval.current = setInterval(() => {
            if (meetingSession && !isMuted) {
                try {
                    // Obtener métricas directamente del observador de audio
                    meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                        meetingSession.configuration.credentials.attendeeId,
                        (attendeeId, volume, muted, signalStrength) => {
                            // Convertir el volumen a un porcentaje (volume viene entre 0 y 1)
                            const levelPercentage = Math.min(Math.round(volume * 100), 100);
                            // Solo actualizar si tenemos un valor válido
                            if (!isNaN(levelPercentage) && levelPercentage >= 0) {
                                setAudioLevel(levelPercentage);
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error en el análisis de audio:', error);
                    // Si hay error, establecer el nivel a 0
                    setAudioLevel(0);
                }
            } else {
                // Si está muteado o no hay sesión, establecer el nivel a 0
                setAudioLevel(0);
            }
        }, 100);
    };



    const startRemoteAudioMonitoring = () => {
        if (remoteAudioAnalyzerInterval.current) {
            clearInterval(remoteAudioAnalyzerInterval.current);
        }

        remoteAudioAnalyzerInterval.current = setInterval(() => {
            if (meetingSession) {
                const attendees = meetingSession.audioVideo.realtimeGetAttendeeIdPresence();
                Object.keys(attendees).forEach(attendeeId => {
                    if (attendeeId !== meetingSession.configuration.credentials.attendeeId) {
                        meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                            attendeeId,
                            (id, volume, muted, signalStrength) => {
                                setRemoteAudioLevel(prev => ({
                                    ...prev,
                                    [id]: {
                                        volume: Math.round(volume * 100),
                                        muted,
                                        signalStrength
                                    }
                                }));
                            }
                        );
                    }
                });
            }
        }, 200);
    };

    // Función para alternar el mute del audio
    const toggleMute = async () => {
        if (!meetingSession) return;
        
        try {
            if (isMuted) {
                await meetingSession.audioVideo.unmute();
            } else {
                await meetingSession.audioVideo.mute();
            }
            setIsMuted(!isMuted);
        } catch (err) {
            console.error('Error al cambiar el estado del audio:', err);
            setError('Error al cambiar el estado del audio: ' + err.message);
        }
    };

    // Iniciar audio y video
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
            if (videoInputDevices.length > 0) {
                await session.audioVideo.startVideoInput(videoInputDevices[0].deviceId);
                setLocalVideo(true);
            }
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
        <div className="p-4 ">
            <div className="mb-4 space-y-4 ">
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

                {meetingSession && (
                    <div className="mb-4 space-y-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={testAudio}
                                className={`px-4 py-2 rounded ${isTestingAudio
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white transition-colors`}
                            >
                                {isTestingAudio ? 'Probando Audio...' : 'Probar Audio'}
                            </button>

                            <button
                                onClick={toggleMute}
                                className={`px-4 py-2 rounded ${isMuted
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    } text-white transition-colors`}
                            >
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>

                            {isTestingAudio && (
                                <div className="flex items-center space-x-2">
                                    <div className="text-sm">Nivel de Audio:</div>
                                    <div className="w-48 h-4 bg-gray-200 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-200"
                                            style={{ width: `${audioLevel}%` }}
                                        />
                                    </div>
                                    <div className="text-sm">{audioLevel}%</div>
                                </div>
                            )}
                        </div>

                        {audioInputDevice && (
                            <div className="text-sm text-gray-600">
                                Dispositivo de audio: {audioInputDevice.label}
                            </div>
                        )}
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

            {/* Nueva sección de videos en split-screen */}
            <div className="flex gap-4 h-96">
                {/* Video local (anfitrión) */}
                {localVideo && (
                    <div className="w-1/2 bg-black rounded overflow-hidden relative">
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

                {/* Video remoto (asistente) - solo mostramos el primer video remoto */}
                {remoteVideos.length > 0 && (
                    <div className="w-1/2 bg-black rounded overflow-hidden relative">
                        <video
                            ref={(el) => (remoteVideoRefs.current[remoteVideos[0]] = el)}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            Asistente
                        </div>
                        {/* Indicador de audio para el asistente */}
                        {Object.entries(remoteAudioLevel).slice(0, 1).map(([attendeeId, data]) => (
                            <div key={attendeeId} className="absolute bottom-2 right-2 flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-200"
                                        style={{ width: `${data.volume}%` }}
                                    />
                                </div>
                                {data.muted && (
                                    <span className="text-red-500 text-xs">
                                        Muteado
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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