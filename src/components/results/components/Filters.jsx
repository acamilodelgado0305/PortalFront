import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

    useEffect(() => {
        setPriceRange({
            min: activeFilters.priceRange?.[0] || 10,
            max: activeFilters.priceRange?.[1] || 35
        });
    }, [activeFilters.priceRange]);

    const handleNameChange = (e) => {
        setActiveFilters((prev) => ({
            ...prev,
            fullName: e.target.value
        }));
    };

    const FilterModal = ({ title, options, onSelect, onClose, isOpen }) => {
        if (!isOpen) return null;

        return (
            <div className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
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
        <div className="relative inline-block">
            <button
                className="bg-white rounded-lg px-4 py-2 text-[#1500F4] text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border-2 border-[#1500F4] rounded-lg"
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
                        width: 300px;
                        height: 40px;
                        margin: 10px 0;
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
                        top: 50%;
                        transform: translateY(-50%);
                        width: 100%;
                        height: 2px;
                        background: #e5e7eb;
                        z-index: 1;
                    }

                    .slider-range {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        height: 2px;
                        background: #1500F4;
                        z-index: 2;
                    }

                    .slider::-webkit-slider-thumb {
                        pointer-events: auto;
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        background: white;
                        border: 2px solid #1500F4;
                        border-radius: 50%;
                        cursor: pointer;
                        margin-top: -7px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }

                    .slider::-moz-range-thumb {
                        pointer-events: auto;
                        width: 16px;
                        height: 16px;
                        background: white;
                        border: 2px solid #1500F4;
                        border-radius: 50%;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }
                `}
            </style>
            <div className="flex flex-col space-y-4 w-full">
                {/* Primera fila */}
                <div className="flex flex-wrap items-center gap-4">
                    <FilterButton label="Idiomas" value={activeFilters.language} filterKey="language" />
                    
                    <div className="relative inline-block">
                        <button
                            className="bg-white rounded-lg px-4 py-2 text-[#1500F4] text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border-2 border-[#1500F4] rounded-lg"
                            onClick={() => setShowFilterModal((prev) => ({ ...prev, priceRange: !prev.priceRange }))}
                        >
                            <span>Precio por hora</span>
                            <span className="text-[#1500F4]">
                                USD ${priceRange.min} - ${priceRange.max}
                            </span>
                        </button>

                        {showFilterModal.priceRange && (
                            <div className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
                                <div className="flex justify-center text-lg font-bold text-gray-800 mb-4">
                                    <span>{`US $${priceRange.min} - US $${priceRange.max}`}</span>
                                </div>
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
                                        value={priceRange.min}
                                        onChange={handleMinChange}
                                        className="slider"
                                    />
                                    <input
                                        type="range"
                                        min="10"
                                        max="35"
                                        value={priceRange.max}
                                        onChange={handleMaxChange}
                                        className="slider"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <FilterButton label="País de nacimiento" value={activeFilters.country} filterKey="country" />
                    <FilterButton label="Disponibilidad" value={activeFilters.availability} filterKey="availability" />
                    
                    <input
                        type="text"
                        placeholder="Buscar por nombre o apellido"
                        value={activeFilters.fullName || ''}
                        onChange={handleNameChange}
                        className="border-2 border-[#1500F4] rounded-lg px-4 py-2 text-lg flex-grow"
                    />
                </div>

                {/* Segunda fila */}
                <div className="flex flex-wrap items-center gap-4">
                    <FilterButton label="Especialidades" value={activeFilters.specialty} filterKey="specialty" />
                    
                    <button
                        className={`bg-white rounded-lg px-4 py-2 text-[#1500F4] border-2 border-[#1500F4] text-lg ${activeFilters.isNative ? 'bg-[#1500F4] text-white' : ''}`}
                        onClick={() => setActiveFilters((prev) => ({ ...prev, isNative: !prev.isNative }))}
                    >
                        Hablante nativo
                    </button>

                    <button
                        onClick={clearFilters}
                        className="bg-gray-100 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-200 border border-gray flex items-center gap-2 text-lg ml-auto"
                    >
                        <X size={16} />
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </>
    );
};

export default Filters;