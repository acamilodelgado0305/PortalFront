import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from './TeacherCard';

const Results = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    priceRange: '',
    country: '',
    availability: '',
    specialty: '',
    language: '',
    isNative: false,
    category: ''
  });

  const [showFilterModal, setShowFilterModal] = useState({
    price: false,
    country: false,
    availability: false,
    specialty: false,
    language: false,
    category: false
  });

  // Opciones de filtro predefinidas con precios en dólares
  const filterOptions = {
    priceRange: [
      '$10 - $25',
      '$25 - $50',
      '$50 - $75',
      '$75 - $100+'
    ],
    country: [
      { code: 'us', name: 'Estados Unidos' },
      { code: 'es', name: 'España' },
      { code: 'mx', name: 'México' },
      { code: 'ar', name: 'Argentina' },
      { code: 'co', name: 'Colombia' },
      { code: 'cl', name: 'Chile' },
      { code: 'pe', name: 'Perú' },
      { code: 've', name: 'Venezuela' },
      { code: 'gb', name: 'Reino Unido' },
      { code: 'ca', name: 'Canadá' }
    ],
    availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    specialty: ['Matemáticas', 'Inglés', 'Ciencias', 'Historia', 'Literatura', 'Física', 'Química'],
    language: ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Italiano']
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('https://back.app.esturio.com/api/teachers');
        const data = await response.json();
        setTeachers(data.data);
        setFilteredTeachers(data.data);
        console.log(data.data)
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los profesores');
        setLoading(false);
        console.error("Error al cargar profesores:", err);
      }
    };

    fetchTeachers();
  }, []);

  const handleVideoClick = (videoUrl) => {
    if (videoUrl) {
      setSelectedVideo(videoUrl);
      setShowVideoModal(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, teachers]);

  const clearFilters = () => {
    setActiveFilters({
      priceRange: '',
      country: '',
      availability: '',
      specialty: '',
      language: '',
      isNative: false,
      category: ''
    });
  };

  const applyFilters = () => {
    let filtered = [...teachers];

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
        .replace(/[^0-9.-]+/g, '')
        .split('-')
        .map(Number);
      filtered = filtered.filter(teacher => {
        const rate = teacher.hourlyRate;
        return rate >= min && (max ? rate <= max : true);
      });
    }

    if (activeFilters.country) {
      const selectedCountry = filterOptions.country.find(c => c.name === activeFilters.country);
      if (selectedCountry) {
        filtered = filtered.filter(teacher =>
          teacher.countryOfBirth?.toLowerCase() === selectedCountry.code.toLowerCase()
        );
      }
    }

    if (activeFilters.isNative) {
      filtered = filtered.filter(teacher =>
        teacher.languageLevel === 'native'
      );
    }

    if (activeFilters.specialty) {
      filtered = filtered.filter(teacher =>
        teacher.subjectYouTeach?.toLowerCase().includes(activeFilters.specialty.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  };

  const VideoModal = ({ videoUrl, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Video de presentación</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        <div className="aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allowFullScreen
            title="Presentación del profesor"
          />
        </div>
      </div>
    </div>
  );

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
        className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border border-gray-200"
        onClick={() => setShowFilterModal(prev => ({ ...prev, [filterKey]: !prev[filterKey] }))}
      >
        <span>{label}</span>
        {value && <span className="text-gray-400">{value}</span>}
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <FilterModal
        title={label}
        options={filterKey === 'country' ? filterOptions[filterKey].map(item => item.name) : filterOptions[filterKey] || []}
        onSelect={(selected) => {
          setActiveFilters(prev => ({ ...prev, [filterKey]: selected }));
        }}
        onClose={() => setShowFilterModal(prev => ({ ...prev, [filterKey]: false }))}
        isOpen={showFilterModal[filterKey]}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center text-xl p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 mr-4"
              aria-label="Regresar"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Profesores particulares online: reserva ya tus clases
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <FilterButton
              label="Precio por hora"
              value={activeFilters.priceRange}
              filterKey="priceRange"
            />
            <FilterButton
              label="País de nacimiento"
              value={activeFilters.country}
              filterKey="country"
            />
            <FilterButton
              label="Disponibilidad"
              value={activeFilters.availability}
              filterKey="availability"
            />
            <FilterButton
              label="Especialidades"
              value={activeFilters.specialty}
              filterKey="specialty"
            />
            <FilterButton
              label="Idiomas"
              value={activeFilters.language}
              filterKey="language"
            />
            <button
              className={`bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 ${activeFilters.isNative ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setActiveFilters(prev => ({ ...prev, isNative: !prev.isNative }))}
            >
              Hablante nativo
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-100 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-200 border border-gray-200 flex items-center gap-2"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {filteredTeachers.length} profesores disponibles para ajustarse a tus necesidades
        </h2>

        <div className="space-y-6 w-[70em]">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onVideoClick={handleVideoClick}
            />
          ))}
          {filteredTeachers.length === 0 && (
            <p className="text-center text-gray-600">
              No se encontraron profesores con los filtros seleccionados.
            </p>
          )}
        </div>
      </div>

      {showVideoModal && selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default Results;