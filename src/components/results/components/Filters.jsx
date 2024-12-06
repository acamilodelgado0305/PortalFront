import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import SetHourt from './SetHourt'; // Asegúrate de que la ruta sea correcta

const Filters = ({
    activeFilters,
    setActiveFilters,
    clearFilters,
    filterOptions,
    showFilterModal,
    setShowFilterModal,
}) => {
    const [priceRange, setPriceRange] = useState({
        min: activeFilters.priceRange?.[0] || 5,
        max: activeFilters.priceRange?.[1] || 100,
    });
    const [showCalendarModal, setShowCalendarModal] = useState(false); // Controlar visibilidad del calendario
    const [availabilityFilters, setAvailabilityFilters] = useState([]); // Acumular días y horarios seleccionados
    const filterRefs = useRef({});


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Revisar cada modal activo
            Object.keys(showFilterModal).forEach((key) => {
                if (showFilterModal[key] && filterRefs.current[key]) {
                    // Verificar si el clic fue fuera del modal
                    if (!filterRefs.current[key].contains(event.target)) {
                        setShowFilterModal((prev) => ({
                            ...prev,
                            [key]: false
                        }));
                    }
                }
            });
        };

        // Agregar event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterModal]);

    useEffect(() => {
        setPriceRange({
            min: activeFilters.priceRange?.[0] || 5,
            max: activeFilters.priceRange?.[1] || 100,
        });
    }, [activeFilters.priceRange]);

    const handleTimeFilterSelect = (filters) => {
        console.log("Filtros de tiempo seleccionados:", filters);
        const updatedFilters = [...availabilityFilters, ...filters];
        setAvailabilityFilters(updatedFilters);

        setActiveFilters((prev) => ({
            ...prev,
            availability: updatedFilters,
        }));
        console.log("Disponibilidad seleccionada:", updatedFilters);
    };

    const renderAvailabilityText = () => {
        return availabilityFilters.length > 0
            ? availabilityFilters
                .map((filter) => `${filter.day} (${filter.start}-${filter.end})`)
                .join(', ')
            : 'Disponibilidad';
    };

    const handleNameChange = (e) => {
        setActiveFilters((prev) => ({
            ...prev,
            fullName: e.target.value,
        }));
    };

    const handleClearFilters = () => {
        setAvailabilityFilters([]); // Limpiar filtros de disponibilidad
        setActiveFilters((prev) => ({
            ...prev,
            availability: [],
        }));
        clearFilters(); // Llamar la función de limpieza general
    };

    const FilterModal = ({ title, options, onSelect, onClose, isOpen, filterKey }) => {
        if (!isOpen) return null;

        return (
            <div
                className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 w-[100%]"
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
        <div className="relative inline-block">
            <div ref={(el) => (filterRefs.current[filterKey] = el)}>
                <button
                    className="bg-white md:text-2xl text-sm p-6 md:w-[10em] w-[11em] md:h-[2.5em] h-[2.9em] font-medium py-3 text-purple-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center border-2 border-purple-600 rounded-xl flex justify-between"
                    onClick={() =>
                        setShowFilterModal((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }))
                    }
                >
                    <span className="truncate mr-2">{label}</span>
                    {value && <span className="text-xl text-gray-400">{value}</span>}
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
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
        </div>
    );

    const handleMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), priceRange.max - 1);
        setPriceRange((prev) => ({ ...prev, min: newMin }));
        setActiveFilters((prev) => ({
            ...prev,
            priceRange: [newMin, prev.priceRange?.[1] || priceRange.max],
        }));
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), priceRange.min + 1);
        setPriceRange((prev) => ({ ...prev, max: newMax }));
        setActiveFilters((prev) => ({
            ...prev,
            priceRange: [prev.priceRange?.[0] || priceRange.min, newMax],
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
                `}
            </style>

            <div className="grid grid-cols-1 gap-8 w-full ">
                <div className="md:col-span-2 md:flex md:flex-wrap grid grid-cols-2 md:flex-row jus gap-3 justify-items-center w-full">


                    <FilterButton
                        label="Idiomas"
                        value={activeFilters.language}
                        filterKey="language"
                    />

                    <div className="relative inline-block" ref={(el) => (filterRefs.current.priceRange = el)}>
                        <button
                            className="bg-white md:w-[15em] w-[11em] md:h-[4.3em] h-[2.9em] text-2xl text-sm p-4 font-medium px-6 py-3 text-purple-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex flex-col items-center space-y-1 border-2 border-purple-600 rounded-xl"
                            onClick={() => setShowFilterModal((prev) => ({ ...prev, priceRange: !prev.priceRange }))}
                        >
                            <div className="text-xs text-purple-600 md:mr-40 mr-24 mt-[-0.5em] md:mt-[-0.8em]">
                                Precio
                            </div>
                            <span className="md:text-2xl text-sm text-purple-600" style={{ marginTop: '-4px', textAlign: 'left' }}>
                                USD ${priceRange.min} - ${priceRange.max}
                            </span>
                        </button>

                        {showFilterModal.priceRange && (
                            <div className="absolute mt-2 bg-white rounded-xl shadow-lg border-2 border-purple-600 text-2xl p-6 z-50">
                                <div className="flex justify-center mt-2 text-2xl font-bold text-purple-600 mb-6">
                                    <span>{`USD $${priceRange.min} - USD $${priceRange.max}`}</span>
                                </div>
                                <div className="px-2">
                                    <div className="slider-container">
                                        <div className="slider-track"></div>
                                        <div
                                            className="slider-range"
                                            style={{
                                                left: `${((priceRange.min - 5) / 95) * 100}%`,
                                                right: `${100 - ((priceRange.max - 5) / 95) * 100}%`,
                                            }}
                                        ></div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            step="1"
                                            value={priceRange.min}
                                            onChange={handleMinChange}
                                            className="slider"
                                        />
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
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
                    {/* Input interactivo de Disponibilidad */}
                    <div className="relative inline-block md:w-[15em] w-[11em] text-sm">
                        <input
                            type="text"
                            readOnly
                            onClick={() => setShowCalendarModal(true)}
                            value={renderAvailabilityText()}
                            className="w-full border-2 md:text-2xl  font-medium border-purple-600 rounded-xl md:h-[2.5em] h-[2.9em] text-center text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <FilterButton

                        label="Especialidades"
                        value={activeFilters.specialty}
                        filterKey="specialty"
                    />


                    <button
                        className={`md:text-2xl text-sm md:w-[12em] w-[11em] md:h-[2.5em] h-[2.9em] p-6 text-center font-medium px-6 py-3 border-2 rounded-xl transition-colors duration-200 ${activeFilters.isNative
                            ? 'bg-white text-purple-600 border-purple-600 hover:bg-gray-50'
                            : 'bg-white text-purple-600 border-purple-600 hover:bg-gray-50'
                            }`}
                        onClick={() =>
                            setActiveFilters((prev) => ({ ...prev, isNative: !prev.isNative }))
                        }
                    >
                        {activeFilters.isNative ? 'Hablante no nativo' : 'Hablante nativo'}
                    </button>
                </div>

                <div className="col-span-1 md:space-y-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="relative w-[11em]">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-600" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={activeFilters.fullName || ''}
                                onChange={handleNameChange}
                                className="w-[12em] border-2 border-purple-600 rounded-xl pl-10 pr-6 py-1 md:py-3 text-xl md:text-2xl text-400 placeholder:text-purple-600"
                            />
                        </div>

                        <button
                            onClick={handleClearFilters}
                            className="ml-4 bg-transparent rounded-xl px-6 py-3 text-xl text-gray-600 border border-gray flex items-center justify-center gap-3 font-medium"
                        >
                            <X size={20} />
                            Limpiar filtros
                        </button>
                    </div>
                </div>


            </div>

            {showCalendarModal && (
                <SetHourt
                    showCalendarModal={showCalendarModal}
                    setShowCalendarModal={setShowCalendarModal}
                    onFilterSelect={handleTimeFilterSelect}
                />
            )}
        </>
    );
};

export default Filters;
