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

const VideoCallRoute = ({ visible }) => {
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
    const audioContextRef = useRef(null);
    const audioAnalyzerRef = useRef(null);
    const [remoteAudioLevel, setRemoteAudioLevel] = useState({});

    
    // Función para probar el audio
    const testAudio = async () => {
        try {
            if (!meetingSession) {
                throw new Error('La sesión no está inicializada');
            }

            setIsTestingAudio(true);

            // Detener cualquier audio previo
            if (audioContextRef.current) {
                await audioContextRef.current.close();
                audioContextRef.current = null;
            }

            // Crear nuevo contexto de audio
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const audioContext = audioContextRef.current;

            // Solicitar permisos y obtener stream
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Crear y configurar analizador
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.8;
            audioAnalyzerRef.current = analyser;

            // Crear procesador de script
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
            const source = audioContext.createMediaStreamSource(stream);
            
            // Conectar nodos
            source.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            // Procesar audio
            scriptProcessor.onaudioprocess = () => {
                if (!isTestingAudio) return;

                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                
                // Calcular RMS (Root Mean Square) para mejor detección de volumen
                const rms = Math.sqrt(
                    array.reduce((acc, val) => acc + (val * val), 0) / array.length
                );
                
                // Aplicar una escala logarítmica para mejor respuesta
                const normalizedLevel = Math.min(
                    Math.round((Math.log(rms + 1) / Math.log(256)) * 100),
                    100
                );

                setAudioLevel(normalizedLevel);
            };

            // Configurar dispositivo en Chime
            const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();
            console.log('Dispositivos de audio disponibles:', audioInputs);

            if (audioInputs.length > 0) {
                const selectedDevice = audioInputs[0];
                console.log('Seleccionando dispositivo:', selectedDevice);
                setAudioInputDevice(selectedDevice);
                await meetingSession.audioVideo.startAudioInput(selectedDevice.deviceId);
            }

        } catch (err) {
            console.error('Error en la prueba de audio:', err);
            setError('Error al probar el audio: ' + err.message);
        }
    };

    const stopAudioTest = async () => {
        setIsTestingAudio(false);
        setAudioLevel(0);

        try {
            // Detener el analizador
            if (audioAnalyzerRef.current) {
                audioAnalyzerRef.current.disconnect();
                audioAnalyzerRef.current = null;
            }

            // Detener el contexto de audio
            if (audioContextRef.current) {
                // Desconectar todos los nodos primero
                const source = audioContextRef.current.createBufferSource();
                source.disconnect();
                
                await audioContextRef.current.close();
                audioContextRef.current = null;
            }

            // Detener el audio en Chime si está activo
            if (meetingSession) {
                await meetingSession.audioVideo.stopAudioInput();
            }
        } catch (err) {
            console.error('Error al detener la prueba de audio:', err);
        }
    };

    // Función para unirse a una reunión
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
            console.log('Joined meeting:', joinData);

            if (!joinData.meeting || !joinData.attendee) {
                throw new Error('No se recibió la información completa de la reunión');
            }

            // Inicializar la sesión y el audio/video
            await initializeMeetingSession(joinData.meeting, joinData.attendee);

            // Verificar el estado del audio después de unirse
            setTimeout(async () => {
                if (meetingSession) {
                    const audioState = await meetingSession.audioVideo.realtimeIsLocalAudioMuted();
                    if (audioState) {
                        console.log('Audio está muteado, intentando unmutear...');
                        await meetingSession.audioVideo.realtimeUnmuteLocalAudio();
                    }
                }
            }, 1000);

        } catch (err) {
            console.error('Error al unirse a la reunión:', err);
            setError(err.message);
        }
    };

    // Inicializar la sesión de la reunión
    const initializeMeetingSession = async (meeting, attendee) => {
        try {
            const logger = new ConsoleLogger('MeetingLogs', LogLevel.DEBUG); // Cambiado a DEBUG para más información
            const deviceController = new DefaultDeviceController(logger);

            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            const session = new DefaultMeetingSession(configuration, logger, deviceController);

            // Configurar observadores
            session.audioVideo.addObserver({
                audioVideoDidStart: async () => {
                    console.log('AudioVideo started - Configurando audio...');
                    try {
                        const audioInputs = await session.audioVideo.listAudioInputDevices();
                        if (audioInputs.length > 0) {
                            await session.audioVideo.startAudioInput(audioInputs[0].deviceId);
                            console.log('Audio input iniciado correctamente');
                        }
                    } catch (err) {
                        console.error('Error al iniciar audio input:', err);
                    }
                },
                audioVideoDidStop: (sessionStatus) => {
                    console.log('AudioVideo stopped:', sessionStatus);
                },
                audioInputDidStart: () => {
                    console.log('Audio input started successfully');
                },
                audioInputDidStop: () => {
                    console.log('Audio input stopped');
                },
                videoTileDidUpdate: (tileState) => {
                    if (!tileState.localTile) {
                        console.log('Remote video updated:', tileState);
                        setRemoteVideos(prev => [...prev, tileState.tileId]);
                    }
                },
                videoTileWasRemoved: (tileId) => {
                    setRemoteVideos(prev => prev.filter(id => id !== tileId));
                },
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
                }
            });

            setMeetingSession(session);
            
            // Inicializar audio y video de manera más robusta
            await initializeAudioVideo(session);

        } catch (err) {
            console.error('Error al inicializar la sesión:', err);
            setError('Error al inicializar la sesión: ' + err.message);
        }
    };

    // Nueva función para inicializar audio y video
    const initializeAudioVideo = async (session) => {
        try {
            console.log('Iniciando configuración de audio/video...');

            // 1. Primero aseguramos los permisos de audio/video
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: true
            });
            console.log('Permisos de audio y video concedidos');

            // 2. Configurar audio de entrada de manera más robusta
            const audioInputs = await session.audioVideo.listAudioInputDevices();
            console.log('Dispositivos de audio disponibles:', audioInputs);

            if (audioInputs.length === 0) {
                throw new Error('No se encontraron dispositivos de audio');
            }

            // Seleccionar el dispositivo de audio predeterminado
            const selectedAudioInput = audioInputs[0];
            console.log('Seleccionando dispositivo de audio:', selectedAudioInput.label);

            // 3. Detener cualquier audio existente y reiniciar
            await session.audioVideo.stopAudioInput().catch(() => {});
            await session.audioVideo.startAudioInput(selectedAudioInput.deviceId);
            setAudioInputDevice(selectedAudioInput);

            // 4. Configurar audio de salida (altavoces)
            const audioOutputs = await session.audioVideo.listAudioOutputDevices();
            if (audioOutputs.length > 0) {
                const selectedOutput = audioOutputs[0];
                await session.audioVideo.chooseAudioOutput(selectedOutput.deviceId);
                console.log('Audio output configurado:', selectedOutput.label);
            }

            // 5. Asegurarnos de que el audio no está muteado por defecto
            await session.audioVideo.realtimeUnmuteLocalAudio();
            setIsMuted(false);

            // 6. Iniciar la sesión de audio/video
            console.log('Iniciando sesión de audio/video...');
            await session.audioVideo.start();
            console.log('Sesión de audio/video iniciada correctamente');

            // 7. Configurar observadores de audio específicos
            session.audioVideo.realtimeSubscribeToAttendeeIdPresence((attendeeId, present) => {
                if (present) {
                    console.log(`Attendee ${attendeeId} joined with audio`);
                    // Asegurarnos de que podemos escuchar al participante
                    session.audioVideo.realtimeSubscribeToVolumeIndicator(
                        attendeeId,
                        (attendeeId, volume, muted, signalStrength) => {
                            console.log(`Volume for ${attendeeId}:`, volume, 'muted:', muted);
                            setRemoteAudioLevel(prev => ({
                                ...prev,
                                [attendeeId]: {
                                    volume: Math.round(volume * 100),
                                    muted,
                                    signalStrength
                                }
                            }));
                        }
                    );
                }
            });

            // 8. Configurar video después del audio
            const videoInputs = await session.audioVideo.listVideoInputDevices();
            if (videoInputs.length > 0) {
                await session.audioVideo.startVideoInput(videoInputs[0].deviceId);
                setLocalVideo(true);
                console.log('Video local iniciado');
            }

        } catch (err) {
            console.error('Error en initializeAudioVideo:', err);
            setError('Error al inicializar audio/video: ' + err.message);
            throw err;
        }
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
            // Configurar audio de entrada
            const audioInputDevices = await session.audioVideo.listAudioInputDevices();
            if (audioInputDevices.length > 0) {
                const inputDevice = audioInputDevices[0];
                await session.audioVideo.startAudioInput(inputDevice.deviceId);
                setAudioInputDevice(inputDevice);
            }

            // Configurar audio de salida
            const audioOutputDevices = await session.audioVideo.listAudioOutputDevices();
            if (audioOutputDevices.length > 0) {
                await session.audioVideo.chooseAudioOutput(audioOutputDevices[0].deviceId);
            }

            // Iniciar la sesión
            await session.audioVideo.start();
            
            // Configurar video
            const videoInputDevices = await session.audioVideo.listVideoInputDevices();
            if (videoInputDevices.length > 0) {
                await session.audioVideo.startVideoInput(videoInputDevices[0].deviceId);
                setLocalVideo(true);
            }

        } catch (err) {
            console.error('Error al iniciar audio/video:', err);
            setError('Error al iniciar audio/video: ' + err.message);
        }
    };

    // Efectos para manejo de video local
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
                console.error('Error al iniciar video local:', err);
            }
        };

        startLocalVideo();

        return () => {
            if (videoTileId) {
                try {
                    meetingSession.audioVideo.unbindVideoElement(videoTileId);
                } catch (err) {
                    console.error('Error al desvincular video:', err);
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

    // Efecto para limpieza
    useEffect(() => {
        return () => {
            if (meetingSession) {
                meetingSession.audioVideo.stop();
            }
            stopAudioTest();
        };
    }, [meetingSession]);

    // JSX del componente
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

                {meetingSession && (
                    <div className="mb-4 space-y-4">
                       

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

            {/* Sección de videos en split-screen */}
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
                            Tú
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-200"
                                    style={{ width: `${audioLevel}%` }}
                                />
                            </div>
                            {isMuted && (
                                <span className="text-red-500 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                    Muteado
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Video remoto (participante) */}
                {remoteVideos.length > 0 && (
                    <div className="w-1/2 bg-black rounded overflow-hidden relative">
                        <video
                            ref={(el) => (remoteVideoRefs.current[remoteVideos[0]] = el)}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            Participante
                        </div>
                        {/* Indicador de audio para el participante remoto */}
                        {Object.entries(remoteAudioLevel).slice(0, 1).map(([attendeeId, data]) => (
                            <div key={attendeeId} className="absolute bottom-2 right-2 flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-200"
                                        style={{ width: `${data.volume}%` }}
                                    />
                                </div>
                                {data.muted && (
                                    <span className="text-red-500 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                        Muteado
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Indicadores de audio remoto */}
            {Object.entries(remoteAudioLevel).length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-semibold mb-2">Audio Remoto</h3>
                    {Object.entries(remoteAudioLevel).map(([attendeeId, data]) => (
                        <div key={attendeeId} className="flex items-center space-x-4 mb-2">
                            <span className="text-sm">Participante</span>
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
                                Señal: {Math.round(data.signalStrength * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoCallRoute;