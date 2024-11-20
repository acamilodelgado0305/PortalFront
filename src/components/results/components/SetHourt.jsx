import React, { useState } from 'react';
import { Modal } from 'antd';
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import './WeeklyCalendar.css';

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
    const [selectedDays, setSelectedDays] = useState([]); // Múltiples días
    const [selectedTimeBlocks, setSelectedTimeBlocks] = useState([]); // Múltiples bloques

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

    // Seleccionar/deseleccionar un día
    const handleDaySelect = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day) // Deseleccionar si ya está seleccionado
                : [...prev, day] // Seleccionar si no está seleccionado
        );
    };

    // Seleccionar/deseleccionar un bloque de tiempo
    const handleTimeBlockSelect = (block) => {
        setSelectedTimeBlocks((prev) =>
            prev.includes(block.key)
                ? prev.filter((b) => b !== block.key) // Deseleccionar si ya está seleccionado
                : [...prev, block.key] // Seleccionar si no está seleccionado
        );
    };

    // Confirmar selección
    const handleConfirm = () => {
        const selectedFilters = selectedDays.map((dayIndex) => {
            const dayInEnglish = dayMapping[daysOfWeek[dayIndex]];
            return selectedTimeBlocks.map((blockKey) => {
                const block = Object.values(timeBlocks)
                    .flat()
                    .find((b) => b.key === blockKey);
                return {
                    day: dayInEnglish,
                    start: block.start,
                    end: block.end
                };
            });
        }).flat();

        onFilterSelect(selectedFilters); // Pasar la selección al padre
        setShowCalendarModal(false); // Cerrar el modal
    };

    // Mostrar selecciones en la parte superior
    const renderSelections = () => {
        const selectedDescriptions = selectedDays.flatMap((dayIndex) => {
            const dayName = daysOfWeek[dayIndex];
            return selectedTimeBlocks.map((blockKey) => {
                const block = Object.values(timeBlocks)
                    .flat()
                    .find((b) => b.key === blockKey);
                return `${dayName} (${block.label})`;
            });
        });

        return selectedDescriptions.length > 0
            ? selectedDescriptions.map((desc, index) => (
                <span
                    key={index}
                    className="bg-purple-100 text-purple-600 text-sm rounded-full px-3 py-1 mr-2 mb-2 inline-flex items-center"
                >
                    {desc}
                </span>
            ))
            : <p className="text-gray-500 text-sm">No se ha seleccionado nada aún.</p>;
    };

    return (
        <Modal
            open={showCalendarModal}
            onCancel={() => setShowCalendarModal(false)}
            footer={
                <div className="flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Confirmar
                    </button>
                </div>
            }
            width={500}
            centered
        >
            <div className="filter-section">
                {/* Mostrar selecciones actuales */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold">Selección actual:</h3>
                    <div className="flex flex-wrap mt-2">
                        {renderSelections()}
                    </div>
                </div>

                {/* Selección del Día */}
                <h3 className="text-lg font-bold mb-2">Días</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            onClick={() => handleDaySelect(index)}
                            className={`day-card cursor-pointer text-center py-2 rounded-lg ${selectedDays.includes(index) ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Selección del Bloque Horario */}
                <h3 className="text-lg font-bold mb-2">Horas</h3>
                {Object.keys(timeBlocks).map((category) => (
                    <div key={category} className="time-category">
                        <p className="font-semibold text-md mb-2">{category}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {timeBlocks[category].map((block) => (
                                <div
                                    key={block.key}
                                    onClick={() => handleTimeBlockSelect(block)}
                                    className={`time-card cursor-pointer p-2 rounded-lg flex flex-col items-center ${selectedTimeBlocks.includes(block.key) ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
                                        }`}
                                >
                                    <div className="icon text-2xl mb-1">{block.icon}</div>
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
