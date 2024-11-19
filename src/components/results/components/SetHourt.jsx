import React, { useState } from 'react';
import { Modal } from 'antd';
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import './WeeklyCalendar.css';

// Mapa de días de español a inglés
const dayMapping = {
    "Dom": "Sunday",
    "Lun": "Monday",
    "Mar": "Tuesday",
    "Mié": "Wednesday",
    "Jue": "Thursday",
    "Vie": "Friday",
    "Sáb": "Saturday"
};

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const SetHourt = ({ showCalendarModal, setShowCalendarModal, onFilterSelect }) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);

    // Agrupación de bloques horarios
    const timeBlocks = {
        "Día": [
            { label: "9:00 Am -12", icon: <SunOutlined />, key: "morning", start: 9, end: 12 },
            { label: "12-15", icon: <SunOutlined />, key: "midday", start: 12, end: 15 },
            { label: "15-18", icon: <SunOutlined />, key: "afternoon", start: 15, end: 18 }
        ],
        "Tarde y Noche": [
            { label: "18-21", icon: <MoonOutlined />, key: "evening", start: 18, end: 21 },
            { label: "21-24", icon: <MoonOutlined />, key: "night", start: 21, end: 24 },
            { label: "0-3", icon: <MoonOutlined />, key: "lateNight", start: 0, end: 3 }
        ],
        "Madrugada": [
            { label: "3-6", icon: <MoonOutlined />, key: "earlyMorning", start: 3, end: 6 },
            { label: "6-9", icon: <SunOutlined />, key: "dawn", start: 6, end: 9 }
        ]
    };

    // Seleccionar el día
    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };

    const handleTimeBlockSelect = (block) => {
        setSelectedTimeBlock(block.key);
        if (selectedDay !== null) {
            // Convierte el día seleccionado al inglés antes de enviarlo
            const dayInEnglish = dayMapping[daysOfWeek[selectedDay]];

            onFilterSelect({
                day: dayInEnglish,
                start: block.start ?? 0, // Asegura que se envíe un valor numérico
                end: block.end ?? 0      // Asegura que se envíe un valor numérico
            });
            setShowCalendarModal(false); // Cierra el modal después de seleccionar
        }
    };

    return (
        <Modal
            //title="Selecciona Día y Bloque Horario"
            open={showCalendarModal}
            onCancel={() => setShowCalendarModal(false)}
            footer={null}
            width={500}
            centered
        >
            <div className="filter-section">
                {/* Selección del Día */}
                <h3 className="text-lg font-bold mb-2">Días</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            onClick={() => handleDaySelect(index)}
                            className={`day-card ${selectedDay === index ? "selected" : ""}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Selección del Bloque Horario con Categorías */}
                <h3 className="text-lg font-bold mb-2">Horas</h3>
                {Object.keys(timeBlocks).map((category) => (
                    <div key={category} className="time-category">
                        <p className="font-semibold text-md mb-2">{category}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {timeBlocks[category].map((block) => (
                                <div
                                    key={block.key}
                                    onClick={() => handleTimeBlockSelect(block)}
                                    className={`time-card ${selectedTimeBlock === block.key ? "selected" : ""}`}
                                >
                                    <div className="icon">{block.icon}</div>
                                    <div className="time-label">{block.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default SetHourt;
