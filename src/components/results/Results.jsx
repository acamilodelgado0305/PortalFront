import React, { useState, useEffect } from 'react';
import { X,ArrowLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Opciones de filtro predefinidas
  const filterOptions = {
    priceRange: [
      '$ 36.000 - $ 50.000',
      '$ 50.000 - $ 75.000',
      '$ 75.000 - $ 100.000',
      '$ 100.000 - $ 145.500+'
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
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los profesores');
        setLoading(false);
        console.error("Error al cargar profesores:", err);
      }
    };

    fetchTeachers();
  }, []);


  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, teachers]);

  const applyFilters = () => {
    let filtered = [...teachers];

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
        .replace(/[^0-9.-]+/g, '')
        .split('-')
        .map(Number);
      filtered = filtered.filter(teacher => {
        const rate = teacher.hourlyRate * 1000;
        return rate >= min && (max ? rate <= max : true);
      });
    }

    if (activeFilters.country) {
      filtered = filtered.filter(teacher =>
        teacher.countryOfBirth?.toLowerCase() === activeFilters.country.toLowerCase()
      );
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
        options={filterOptions[filterKey] || []}
        onSelect={(selected) => {
          setActiveFilters(prev => ({ ...prev, [filterKey]: selected }));
        }}
        onClose={() => setShowFilterModal(prev => ({ ...prev, [filterKey]: false }))}
        isOpen={showFilterModal[filterKey]}
      />
    </div>
  );

  const TeacherCard = ({ teacher }) => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(price * 1000);
    };

    const handleVideoClick = (videoUrl) => {
      setSelectedVideo(videoUrl);
      setShowVideoModal(true);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={teacher.profileImageUrl || 'https://via.placeholder.com/128x128'}
              alt={`${teacher.firstName || 'Nombre'} ${teacher.lastName || 'Apellido'}`}
              className="w-full h-full object-cover rounded-lg bg-gray-200"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128x128';
              }}
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <span>{`${teacher.firstName || 'Nombre'} ${teacher.lastName || 'Apellido'}`}</span>
                  <span className="text-purple-600 text-sm bg-purple-100 px-2 py-1 rounded">
                    {teacher.languageLevel === 'native' ? '✓ Nativo' : '✓ Verificado'}
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">
                  {teacher.subjectYouTeach ? teacher.subjectYouTeach.charAt(0).toUpperCase() + teacher.subjectYouTeach.slice(1) : 'Materia no disponible'}
                </p>
                {teacher.description?.headline && (
                  <p className="text-sm text-gray-500 mt-1">{teacher.description.headline}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-purple-600">
                  {formatPrice(teacher.hourlyRate)}/hora
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 line-clamp-2">
                {teacher.description?.introduction || 'No hay descripción disponible'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {teacher.certifications?.length > 0 && (
                  <span>✓ {teacher.certifications.length} certificaciones</span>
                )}
                {teacher.education?.length > 0 && (
                  <span>🎓 {teacher.education.length} títulos académicos</span>
                )}
                <span>🌍 {teacher.countryOfBirth?.toUpperCase() || 'País no disponible'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => console.log('Enviar mensaje a:', teacher.email)}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
          >
            Enviar mensaje
          </button>
          <button
            onClick={() => handleVideoClick(teacher.video)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Ver presentación
          </button>
        </div>
      </div>
    );
  };

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

          <div className="flex flex-wrap gap-4 mb-6">
            <FilterButton
              label="Precio de la clase"
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
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              className={`bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 ${activeFilters.specialty ? 'ring-2 ring-purple-500' : ''
                }`}
              onClick={() => setShowFilterModal(prev => ({ ...prev, specialty: !prev.specialty }))}
            >
              Especialidades
            </button>
            <button
              className={`bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 ${activeFilters.language ? 'ring-2 ring-purple-500' : ''
                }`}
              onClick={() => setShowFilterModal(prev => ({ ...prev, language: !prev.language }))}
            >
              El profesor habla
            </button>
            <button
              className={`bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 ${activeFilters.isNative ? 'ring-2 ring-purple-500' : ''
                }`}
              onClick={() => setActiveFilters(prev => ({ ...prev, isNative: !prev.isNative }))}
            >
              Hablante nativo
            </button>
            <button
              className={`bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 ${activeFilters.category ? 'ring-2 ring-purple-500' : ''
                }`}
              onClick={() => setShowFilterModal(prev => ({ ...prev, category: !prev.category }))}
            >
              Categorías del profesor
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {filteredTeachers.length} profesores disponibles para ajustarse a tus necesidades
        </h2>

        <div className="space-y-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
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