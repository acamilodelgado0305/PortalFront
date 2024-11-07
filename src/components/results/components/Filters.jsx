import React, { useState } from 'react';
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
        min: activeFilters.priceRange?.[0] || 0,
        max: activeFilters.priceRange?.[1] || 100
    });

    const handleLastNameChange = (e) => {
        setActiveFilters((prev) => ({ ...prev, lastName: e.target.value }));
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
                className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border border-black"
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

    const handleMinPriceChange = (e) => {
        const newMin = Math.min(Number(e.target.value), priceRange.max);
        setPriceRange(prev => ({ ...prev, min: newMin }));
        setActiveFilters(prev => ({ ...prev, priceRange: [newMin, priceRange.max] }));
    };

    const handleMaxPriceChange = (e) => {
        const newMax = Math.max(Number(e.target.value), priceRange.min);
        setPriceRange(prev => ({ ...prev, max: newMax }));
        setActiveFilters(prev => ({ ...prev, priceRange: [priceRange.min, newMax] }));
    };

    const calculateProgress = (value, min, max) => {
        return ((value - min) / (max - min)) * 100;
    };

    return (
        <>
            <style>
                {`
                    .range-slider {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 100%;
                        height: 16px;
                        border-radius: 4px;
                        background: #e5e7eb;
                        outline: none;
                        margin: 10px 0;
                    }

                    .range-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        margin-top: -0.18em;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #8b5cf6;
                        cursor: pointer;
                        border: 1px solid white;
                        box-shadow: 0 0 2px rgba(0,0,0,0.2);
                    }

                    .range-slider::-moz-range-thumb {
                        width: 16px;
                        height: 18px;
                        border-radius: 70%;
                        background: #8b5cf6;
                        cursor: pointer;
                        border: 2px solid white;
                        box-shadow: 0 0 2px rgba(0,0,0,0.2);
                    }

                    .range-slider::-webkit-slider-runnable-track {
                        height: 4px;
                        background: linear-gradient(to right, #8b5cf6 var(--progress), #e5e7eb var(--progress));
                        border-radius: 4px;
                    }

                    .range-slider::-moz-range-track {
                        height: 4px;
                        background: linear-gradient(to right, #8b5cf6 var(--progress), #e5e7eb var(--progress));
                        border-radius: 4px;
                    }
                `}
            </style>
            <div className="flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={activeFilters.lastName || ''}
                    onChange={handleLastNameChange}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                />
                
                <div className="relative inline-block">
                    <button
                        className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border border-black"
                        onClick={() => setShowFilterModal((prev) => ({ ...prev, priceRange: !prev.priceRange }))}
                    >
                        <span>Precio por hora</span>
                        <span className="text-gray-400">${priceRange.min} - ${priceRange.max}</span>
                    </button>

                    {showFilterModal.priceRange && (
                        <div className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-6 w-64">
                            <h3 className="font-semibold mb-4">Rango de Precio por Hora</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1">Precio mínimo: ${priceRange.min}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={priceRange.min}
                                        onChange={handleMinPriceChange}
                                        className="range-slider"
                                        style={{ '--progress': `${calculateProgress(priceRange.min, 0, 100)}%` }}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm mb-1">Precio máximo: ${priceRange.max}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={priceRange.max}
                                        onChange={handleMaxPriceChange}
                                        className="range-slider"
                                        style={{ '--progress': `${calculateProgress(priceRange.max, 0, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <FilterButton label="País de nacimiento" value={activeFilters.country} filterKey="country" />
                <FilterButton label="Disponibilidad" value={activeFilters.availability} filterKey="availability" />
                <FilterButton label="Especialidades" value={activeFilters.specialty} filterKey="specialty" />
                <FilterButton label="Idiomas" value={activeFilters.language} filterKey="language" />
                <button
                    className={`bg-white rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-gray-700 hover:bg-gray-50 border border-gray ${activeFilters.isNative ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, isNative: !prev.isNative }))}
                >
                    Hablante nativo
                </button>
                <button
                    onClick={clearFilters}
                    className="bg-gray-100 rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-gray-600 hover:bg-gray-200 border border-gray flex items-center gap-2"
                >
                    <X size={16} />
                    Limpiar filtros
                </button>
            </div>
        </>
    );
};

export default Filters;