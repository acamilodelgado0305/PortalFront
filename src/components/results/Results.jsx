import React, { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { readAllTeachers } from "../../services/teacher.services.js";
import { getFlagUrl } from "../../services/allcountries.js";
import { FcGraduationCap, FcReading, FcQuestions   } from "react-icons/fc";

const Results = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    priceRange: "",
    country: "",
    availability: "",
    specialty: "",
    language: "",
    isNative: false,
    category: "",
  });

  const [showFilterModal, setShowFilterModal] = useState({
    price: false,
    country: false,
    availability: false,
    specialty: false,
    language: false,
    category: false,
  });

  // Opciones de filtro predefinidas
  const filterOptions = {
    priceRange: [
      "$ 36.000 - $ 50.000",
      "$ 50.000 - $ 75.000",
      "$ 75.000 - $ 100.000",
      "$ 100.000 - $ 145.500+",
    ],
    availability: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
    specialty: [
      "Matemáticas",
      "Inglés",
      "Ciencias",
      "Historia",
      "Literatura",
      "Física",
      "Química",
    ],
    language: [
      "Español",
      "Inglés",
      "Francés",
      "Alemán",
      "Portugués",
      "Italiano",
    ],
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await readAllTeachers();
        setTeachers(response.data);
        setFilteredTeachers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los profesores");
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
        .replace(/[^0-9.-]+/g, "")
        .split("-")
        .map(Number);
      filtered = filtered.filter((teacher) => {
        const rate = teacher.hourlyRate * 1000;
        return rate >= min && (max ? rate <= max : true);
      });
    }

    if (activeFilters.country) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.countryOfBirth?.toLowerCase() ===
          activeFilters.country.toLowerCase(),
      );
    }

    if (activeFilters.isNative) {
      filtered = filtered.filter(
        (teacher) => teacher.languageLevel === "native",
      );
    }

    if (activeFilters.specialty) {
      filtered = filtered.filter((teacher) =>
        teacher.subjectYouTeach
          ?.toLowerCase()
          .includes(activeFilters.specialty.toLowerCase()),
      );
    }

    setFilteredTeachers(filtered);
  };

  const VideoModal = ({ videoUrl, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Video de presentación</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        <div className="aspect-video">
          <iframe
            src={videoUrl}
            className="h-full w-full"
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
      <div className="absolute z-20 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-4">
          <h3 className="mb-3 font-semibold">{title}</h3>
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
                className="block w-full rounded px-4 py-2 text-left hover:bg-gray-50"
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
        className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() =>
          setShowFilterModal((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey],
          }))
        }
      >
        <span>{label}</span>
        {value && <span className="text-gray-400">{value}</span>}
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <FilterModal
        title={label}
        options={filterOptions[filterKey] || []}
        onSelect={(selected) => {
          setActiveFilters((prev) => ({ ...prev, [filterKey]: selected }));
        }}
        onClose={() =>
          setShowFilterModal((prev) => ({ ...prev, [filterKey]: false }))
        }
        isOpen={showFilterModal[filterKey]}
      />
    </div>
  );

  const TeacherCard = ({ teacher }) => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(price * 1000);
    };

    const handleVideoClick = (videoUrl) => {
      setSelectedVideo(videoUrl);
      setShowVideoModal(true);
    };

    const flagImageUrl = getFlagUrl(teacher.countryOfBirth)
    return (
      <div className="mb-4 rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="h-32 w-32 flex-shrink-0">
            <img
              src={
                teacher.profileImageUrl || "https://via.placeholder.com/128x128"
              }
              alt={`${teacher.firstName || "Nombre"} ${teacher.lastName || "Apellido"}`}
              className="h-full w-full rounded-lg bg-gray-200 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/128x128";
              }}
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="flex items-center space-x-2 text-xl font-semibold">
                  <span>{`${teacher.firstName || "Nombre"} ${teacher.lastName || "Apellido"}`}</span>
                  <span className="rounded bg-purple-100 px-2 py-1 text-sm text-purple-600">
                    {teacher.languageLevel === "native"
                      ? "✓ Nativo"
                      : "✓ Verificado"}
                  </span>
                </h3>
                <span className="flex items-center gap-1"><FcReading style={{fontSize: '22px'}}/> 
                <p className="mt-1 text-[15px]  text-gray-600"> 
                  {teacher.subjectYouTeach
                    ? teacher.subjectYouTeach.charAt(0).toUpperCase() +
                      teacher.subjectYouTeach.slice(1)
                    : "Materia no disponible"}
                </p></span>
                {teacher.description?.headline && (<span className="flex items-center gap-1"> <FcQuestions  style={{fontSize: '20px'}} />
                  <p className="mt-1 text-[15px]  text-gray-500">
                    {teacher.description.headline}
                  </p></span>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-purple-600">
                  {formatPrice(teacher.hourlyRate)}/hora
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="line-clamp-2 text-gray-700">
                {teacher.description?.introduction ||
                  "No hay descripción disponible"}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[15px] text-gray-600">
                {teacher.certifications?.length > 0 && (
                  <span>✓{teacher.certifications.length} certificaciones</span>
                )}
                {teacher.education?.length > 0 && (
                  <span className="flex items-center gap-1 text-[15px]"><FcGraduationCap/> {teacher.education.length} títulos académicos</span>
                )}
            <span className="flex items-center gap-1">
                  <img
                    style={{ width: "25px", height: "15.4px" }}
                    src={flagImageUrl}
                    alt="flag"
                  />
                  {teacher.countryOfBirth?.toUpperCase() ||
                    "País no disponible"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => console.log("Enviar mensaje a:", teacher.email)}
            className="rounded-lg border border-purple-600 px-6 py-2 text-purple-600 transition-colors duration-200 hover:bg-purple-50"
          >
            Enviar mensaje
          </button>
          <button
            onClick={() => handleVideoClick(teacher.video)}
            className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors duration-200 hover:bg-purple-700"
          >
            Ver presentación
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-6 flex items-center">
            <button
              onClick={handleBack}
              className="mr-2 rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
              aria-label="Regresar"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Profesores particulares online: reserva ya tus clases
            </h1>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
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
              className={`rounded-lg bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 ${
                activeFilters.specialty ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() =>
                setShowFilterModal((prev) => ({
                  ...prev,
                  specialty: !prev.specialty,
                }))
              }
            >
              Especialidades
            </button>
            <button
              className={`rounded-lg  bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 ${
                activeFilters.language ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() =>
                setShowFilterModal((prev) => ({
                  ...prev,
                  language: !prev.language,
                }))
              }
            >
              El profesor habla
            </button>
            <button
              className={`rounded-lg  bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 ${
                activeFilters.isNative ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  isNative: !prev.isNative,
                }))
              }
            >
              Hablante nativo
            </button>
            <button
              className={`rounded-lg bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 ${
                activeFilters.category ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() =>
                setShowFilterModal((prev) => ({
                  ...prev,
                  category: !prev.category,
                }))
              }
            >
              Categorías del profesor
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          {filteredTeachers.length} profesores disponibles para ajustarse a tus
          necesidades
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
