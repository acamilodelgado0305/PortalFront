import React, { useState, useEffect } from 'react';

const Results = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: '$ 36.000 - $ 145.500+',
    country: 'Colombia',
    availability: 'Mar'
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('https://back.app.esturio.com/api/teachers');
        const data = await response.json();
        setTeachers(data.data);
        setLoading(false);
        console.log("Datos de profesores cargados:", data.data);
      } catch (err) {
        setError('Error al cargar los profesores');
        setLoading(false);
        console.error("Error al cargar profesores:", err);
      }
    };

    fetchTeachers();
  }, []);

  const FilterButton = ({ label, value, icon }) => (
    <div className="relative inline-block">
      <button className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-2 border border-gray-200">
        <span>{label}</span>
        <span className="text-gray-400">{value}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );

  const TeacherCard = ({ teacher }) => {
    // Formatear el precio para mostrarlo en formato de moneda
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(price * 1000); // Multiplicamos por 1000 para convertir a pesos colombianos
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
            onClick={() => window.open(teacher.video, '_blank')}
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Profesores particulares online: reserva ya tus clases
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <FilterButton label="Precio de la clase" value={filters.priceRange} />
            <FilterButton label="País de nacimiento" value={filters.country} />
            <FilterButton label="Disponibilidad" value={filters.availability} />
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200">
              Especialidades
            </button>
            <button className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200">
              El profesor habla
            </button>
            <button className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200">
              Hablante nativo
            </button>
            <button className="bg-white rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200">
              Categorías del profesor
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {teachers.length} profesores disponibles para ajustarse a tus necesidades
        </h2>

        <div className="space-y-6">
          {Array.isArray(teachers) && teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
          {Array.isArray(teachers) && teachers.length === 0 && (
            <p className="text-center text-gray-600">
              No se encontraron profesores disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;