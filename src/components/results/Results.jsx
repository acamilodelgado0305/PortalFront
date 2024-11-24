import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from './TeacherCard';
import ModalRegister from './modalRegister';
import CalendarModal from './components/calendar';
import Filters from './components/Filters'; 
import Header from './Header';
import { readAllTeachers } from '../../services/teacher.services';
import EditReservation from '../dashboard/editReservation'; // eliminar si es necesario al momento de implementar la edicion de la reserva de la clase
import { useAuth } from '../../Context/AuthContext'; // eliminar si es necesario al momento de implementar la edicion de la reserva de la clase

const Results = () => {
   const {user} = useAuth(); // eliminar si es necesario al momento de implementar la edicion de la reserva de la clase

  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
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
    priceRange: false,
    country: false,
    availability: false,
    specialty: false,
    language: false,
    category: false
  });

  const filterOptions = {
    priceRange: [10, 35],
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

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  useEffect(() => {
    const getAllTeachers = async () => {
      try {
        const response = await fetch("https://back.app.esturio.com/api/teachers");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();

        // Verificar si la respuesta tiene la estructura esperada
        if (!rawData.success || !rawData.data) {
          throw new Error('Formato de respuesta inválido');
        }

        // Asumiendo que rawData.data contiene el array de profesores
        const teachersArray = Array.isArray(rawData.data) ? rawData.data : [rawData.data];

        setTeachers(teachersArray);
        setFilteredTeachers(teachersArray);
        console.log('Profesores cargados:', teachersArray);
      } catch (err) {
        setError('Error al cargar los profesores: ' + err.message);
        setTeachers([]);
        setFilteredTeachers([]);
        console.error("Error al cargar profesores:", err);
      } finally {
        setLoading(false);
      }
    };

    getAllTeachers();
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
      priceRange: [0, 35],
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

    // Filtro por nombre completo
    if (activeFilters.fullName) {
      const searchTerm = activeFilters.fullName.toLowerCase();
      filtered = filtered.filter((teacher) => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
    }

    // Filtro por rango de precio
    if (activeFilters.priceRange && Array.isArray(activeFilters.priceRange)) {
      const [min, max] = activeFilters.priceRange;
      filtered = filtered.filter(teacher => {
        const rate = parseFloat(teacher.hourlyRate);
        return rate >= min && rate <= max;
      });
    }

    // Filtro por país
    if (activeFilters.country) {
      const selectedCountry = filterOptions.country.find(c => c.name === activeFilters.country);
      if (selectedCountry) {
        filtered = filtered.filter(teacher =>
          teacher.countryOfBirth?.toLowerCase() === selectedCountry.code.toLowerCase()
        );
      }
    }

    // Filtro por hablante nativo
    if (activeFilters.isNative) {
      filtered = filtered.filter(teacher =>
        teacher.languageLevel?.toLowerCase() === 'native'
      );
    }

    // Filtro por especialidad
    if (activeFilters.specialty) {
      filtered = filtered.filter(teacher =>
        teacher.subjectYouTeach?.toLowerCase().includes(activeFilters.specialty.toLowerCase())
      );
    }

    // Filtro por idioma
    if (activeFilters.language) {
      filtered = filtered.filter(teacher =>
        teacher.languages?.some(lang =>
          lang.toLowerCase() === activeFilters.language.toLowerCase()
        )
      );
    }

    // Filtro por disponibilidad
    if (activeFilters.availability) {
      filtered = filtered.filter(teacher =>
        teacher.availability?.includes(activeFilters.availability)
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

  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
  };

  const closeRegisterModal = (teacher) => {
    setSelectedTeacher(teacher);
    setRegisterModal(!registerModal);
    if (teacher == null) {
      setSelectedTeacher(null);
      return;
    }
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
    <div className='w-full'>

      <div>
        <Header
        />
      </div >

      <span className="flex items-center justify-center  text-black text-5xl text-bold">
        Profesores particulares online: Prueba una clase
      </span>



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
            </div>

            {/* Incluir el componente Filters */}
            <Filters
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              clearFilters={clearFilters}
              filterOptions={filterOptions}
              showFilterModal={showFilterModal}
              setShowFilterModal={setShowFilterModal}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {filteredTeachers.length} profesores disponibles para ajustarse a tus necesidades
          </h2>

          <div className="space-y-6">
            {filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onVideoClick={handleVideoClick}
                closeRegisterModal={closeRegisterModal}
                setSelectedTeacher={setSelectedTeacher}
                setShowCalendarModal={setShowCalendarModal}
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
      {registerModal &&
        <ModalRegister selectedTeacher={selectedTeacher} closeRegisterModal={closeRegisterModal} />

      }
      {
        showCalendarModal
        &&
         //  este componente comentado se utiliza para realizar la reprogramacion de la de la reserva del estudiante por parte del profesor
         //<EditReservation teacher={selectedTeacher} setShowCalendarModal={setShowCalendarModal} idReservation={"9fc0b056-f8fa-4021-876b-eb07c26ccd8b"} studentId={user.id}/>
         
        <CalendarModal teacher={selectedTeacher} setShowCalendarModal={setShowCalendarModal} showCalendarModal={showCalendarModal} />

      }
    </div>
  );
};

export default Results;
