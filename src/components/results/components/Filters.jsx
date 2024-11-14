import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import CalendarModal from '../components/calendar'; // Asegúrate de que la ruta sea correcta

const Filters = ({
    activeFilters,
    setActiveFilters,
    clearFilters,
    filterOptions,
    showFilterModal,
    setShowFilterModal
}) => {
    const [priceRange, setPriceRange] = useState({
        min: activeFilters.priceRange?.[0] || 10,
        max: activeFilters.priceRange?.[1] || 35
    });
    const [showCalendarModal, setShowCalendarModal] = useState(false); // Controlar visibilidad del calendario
    const filterRefs = useRef({});

    const defaultTeacher = {
        Availability: {
            Sunday: { enabled: false, timeSlots: [] },
            Monday: {
                enabled: true,
                timeSlots: [
                    { start: new Date(2024, 10, 11, 9, 0), end: new Date(2024, 10, 11, 11, 0) },
                    { start: new Date(2024, 10, 11, 13, 0), end: new Date(2024, 10, 11, 15, 0) }
                ]
            },
            Tuesday: {
                enabled: true,
                timeSlots: [
                    { start: new Date(2024, 10, 12, 10, 0), end: new Date(2024, 10, 12, 12, 0) }
                ]
            },
            Wednesday: {
                enabled: true,
                timeSlots: [
                    { start: new Date(2024, 10, 13, 9, 0), end: new Date(2024, 10, 13, 11, 0) },
                    { start: new Date(2024, 10, 13, 14, 0), end: new Date(2024, 10, 13, 16, 0) }
                ]
            },
            Thursday: {
                enabled: true,
                timeSlots: [
                    { start: new Date(2024, 10, 14, 13, 0), end: new Date(2024, 10, 14, 15, 0) }
                ]
            },
            Friday: {
                enabled: true,
                timeSlots: [
                    { start: new Date(2024, 10, 15, 8, 0), end: new Date(2024, 10, 15, 10, 0) },
                    { start: new Date(2024, 10, 15, 12, 0), end: new Date(2024, 10, 15, 14, 0) }
                ]
            },
            Saturday: { enabled: false, timeSlots: [] }
        }
    };

    useEffect(() => {
        setPriceRange({
            min: activeFilters.priceRange?.[0] || 10,
            max: activeFilters.priceRange?.[1] || 35
        });
    }, [activeFilters.priceRange]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(showFilterModal).forEach((filterKey) => {
                if (showFilterModal[filterKey] && filterRefs.current[filterKey] &&
                    !filterRefs.current[filterKey].contains(event.target)) {
                    setShowFilterModal(prev => ({
                        ...prev,
                        [filterKey]: false
                    }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterModal, setShowFilterModal]);

    const handleNameChange = (e) => {
        setActiveFilters((prev) => ({
            ...prev,
            fullName: e.target.value
        }));
    };

    const FilterModal = ({ title, options, onSelect, onClose, isOpen, filterKey }) => {
        if (!isOpen) return null;

        return (
            <div
                ref={el => filterRefs.current[filterKey] = el}
                className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
            >
                <div className="p-4">
                    <h3 className="font-semibold mb-3">{title}</h3>
                    <div className="space-y-2">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onSelect(option);
                                    onClose();
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const FilterButton = ({ label, value, filterKey }) => (
        <div className="relative inline-block" ref={el => filterRefs.current[filterKey] = el}>
            <button
                className="bg-white text-2xl p-6 w-[10em] h-[2.5em] font-medium px-6 py-3 text-purple-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-3 border-2 border-purple-600 rounded-xl"
                onClick={() =>
                    setShowFilterModal((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }))
                }
            >
                <span>{label}</span>
                {value && <span className="text-gray-400">{value}</span>}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <FilterModal
                title={label}
                options={
                    filterKey === 'country'
                        ? filterOptions[filterKey].map((item) => item.name)
                        : filterOptions[filterKey] || []
                }
                onSelect={(selected) => {
                    setActiveFilters((prev) => ({ ...prev, [filterKey]: selected }));
                }}
                onClose={() => setShowFilterModal((prev) => ({ ...prev, [filterKey]: false }))}
                isOpen={showFilterModal[filterKey]}
                filterKey={filterKey}
            />
        </div>
    );

    const handleMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), priceRange.max - 1);
        setPriceRange(prev => ({ ...prev, min: newMin }));
        setActiveFilters(prev => ({
            ...prev,
            priceRange: [newMin, prev.priceRange?.[1] || priceRange.max]
        }));
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), priceRange.min + 1);
        setPriceRange(prev => ({ ...prev, max: newMax }));
        setActiveFilters(prev => ({
            ...prev,
            priceRange: [prev.priceRange?.[0] || priceRange.min, newMax]
        }));
    };

    return (
        <>
            <style>
                {`
                    .slider-container {
                        position: relative;
                        width: 100%;
                        height: 30px;
                    }
                    .slider {
                        position: absolute;
                        pointer-events: none;
                        -webkit-appearance: none;
                        appearance: none;
                        width: 100%;
                        height: 2px;
                        background: none;
                        z-index: 3;
                    }
                    .slider-track {
                        position: absolute;
                        width: 100%;
                        height: 2px;
                        background: #e5e7eb;
                        z-index: 1;
                    }
                    .slider-range {
                        position: absolute;
                        height: 2px;
                        background: #A855F7;
                        z-index: 2;
                    }
                    .slider::-webkit-slider-thumb {
                        pointer-events: auto;
                        -webkit-appearance: none;
                        appearance: none;
                        width: 12px;
                        height: 20px;
                        background: white;
                        border: 2px solid #A855F7;
                        border-radius: 2px;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }
                    .slider::-moz-range-thumb {
                        pointer-events: auto;
                        width: 12px;
                        height: 20px;
                        background: white;
                        border: 2px solid #A855F7;
                        border-radius: 2px;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }
                    .slider::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                    }
                    .slider::-moz-range-thumb:hover {
                        transform: scale(1.1);
                    }
                `}
            </style>

            <div className="grid grid-cols-3 gap-8">
                {/* Primera columna (más ancha - 2 columnas de 3) */}
                <div className="col-span-2 flex flex-wrap gap-4 w-[70em]">
                    <FilterButton
                        label="Idiomas"
                        value={activeFilters.language}
                        filterKey="language"
                    />

                    <div className="relative inline-block" ref={el => filterRefs.current.priceRange = el}>
                        <button
                            className="bg-white w-[10em] h-[2.5em] text-2xl p-4 font-medium px-6 py-3 text-purple-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex flex-col items-center space-y-1 border-2 border-purple-600 rounded-xl"
                            onClick={() => setShowFilterModal((prev) => ({ ...prev, priceRange: !prev.priceRange }))}
                        >
                            <div className="text-sm text-purple-600 mr-44 mt-[-0.8em]">
                                Precio
                            </div>
                            <span className="text-2xl text-purple-600" style={{ marginTop: '-8px', textAlign: 'left' }}>
                                USD ${priceRange.min} - ${priceRange.max}
                            </span>
                        </button>

                        {showFilterModal.priceRange && (
                            <div className="absolute mt-2 bg-white rounded-xl shadow-lg border-2 border-purple-600 text-2xl p-6 z-50">
                                <div className="flex justify-center mt-2 text-2xl font-bold text-purple-600 mb-6">
                                    <span>{`US $${priceRange.min} - US $${priceRange.max}`}</span>
                                </div>
                                <div className="px-2">
                                    <div className="slider-container">
                                        <div className="slider-track"></div>
                                        <div
                                            className="slider-range"
                                            style={{
                                                left: `${((priceRange.min - 10) / 25) * 100}%`,
                                                right: `${100 - ((priceRange.max - 10) / 25) * 100}%`,
                                            }}
                                        ></div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="35"
                                            step="1"
                                            value={priceRange.min}
                                            onChange={handleMinChange}
                                            className="slider"
                                        />
                                        <input
                                            type="range"
                                            min="10"
                                            max="35"
                                            step="1"
                                            value={priceRange.max}
                                            onChange={handleMaxChange}
                                            className="slider"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <FilterButton
                        label="País"
                        value={activeFilters.country}
                        filterKey="country"
                    />

                    {/* Botón para mostrar el calendario */}
                    <button
                        className="bg-white w-[10em] h-[2.5em] text-2xl p-4 font-medium px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-gray-50"
                        onClick={() => setShowCalendarModal(true)}
                    >
                        Disponibilidad
                    </button>

                    <FilterButton
                        label="Especialidades"
                        value={activeFilters.specialty}
                        filterKey="specialty"
                    />

                    <button
                        className={`bg-white text-2xl w-[10em] h-[2.5em] p-6 font-medium px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-gray-50 ${activeFilters.isNative ? 'bg-blue-50' : ''}`}
                        onClick={() => setActiveFilters((prev) => ({ ...prev, isNative: !prev.isNative }))}
                    >
                        Hablante nativo
                    </button>
                </div>

                {/* Segunda columna */}
                <div className="col-span-1 space-y-4 pl-[7em]">
                    <div className="relative w-[11em]">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-600" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={activeFilters.fullName || ''}
                            onChange={handleNameChange}
                            className="w-[12em] border-2 border-purple-600 rounded-xl pl-10 pr-6 py-3 text-2xl text-400 placeholder:text-purple-600"
                        />
                    </div>

                    <button
                        onClick={clearFilters}
                        className="w-full bg-transparent rounded-xl px-6 py-3 text-xl text-gray-600 border border-gray flex items-center justify-center gap-3 font-medium fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <X size={20} />
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* CalendarModal, visible según el estado `showCalendarModal` */}
            {showCalendarModal && (
                <CalendarModal
                    showCalendarModal={showCalendarModal}
                    setShowCalendarModal={setShowCalendarModal}
                    teacher={defaultTeacher}
                />
            )}
        </>
    );
};

export default Filters;
