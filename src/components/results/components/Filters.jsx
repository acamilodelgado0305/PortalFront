import React from 'react';
import { X } from 'lucide-react';

const Filters = ({
    activeFilters,
    setActiveFilters,
    clearFilters,
    filterOptions,
    showFilterModal,
    setShowFilterModal
}) => {

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

    return (
        <div className="flex flex-wrap items-center gap-4">
            <input
                type="text"
                placeholder="Buscar por nombre"
                value={activeFilters.lastName || ''}
                onChange={handleLastNameChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <FilterButton label="Precio por hora" value={activeFilters.priceRange} filterKey="priceRange" />
            <FilterButton label="País de nacimiento" value={activeFilters.country} filterKey="country" />
            <FilterButton label="Disponibilidad" value={activeFilters.availability} filterKey="availability" />
            <FilterButton label="Especialidades" value={activeFilters.specialty} filterKey="specialty" />
            <FilterButton label="Idiomas" value={activeFilters.language} filterKey="language" />
            <button
                className={`bg-white rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-gray-700 hover:bg-gray-50 border border-gray ${activeFilters.isNative ? 'ring-2 ring-purple-500' : ''
                    }`}
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
    );
};

export default Filters;
