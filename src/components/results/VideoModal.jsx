import React, { useState } from 'react';

// Formatear el precio para mostrarlo en formato de moneda
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(price * 1000); // Multiplicamos por 1000 para convertir a pesos colombianos
};

const TeacherCard = ({ teacher }) => {
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

const TeacherList = ({ teachers }) => {
  const [filters, setFilters] = useState({
    subject: '',
    country: '',
    maxPrice: 150,
    languageLevel: ''
  });

  // Función para actualizar los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Filtrar profesores con los filtros actuales
  const filteredTeachers = teachers.filter((teacher) => {
    return (
      (filters.subject === '' || teacher.subjectYouTeach?.toLowerCase().includes(filters.subject.toLowerCase())) &&
      (filters.country === '' || teacher.countryOfBirth?.toLowerCase() === filters.country.toLowerCase()) &&
      (filters.languageLevel === '' || teacher.languageLevel === filters.languageLevel) &&
      (teacher.hourlyRate <= filters.maxPrice)
    );
  });

  return (
    <div>
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Filtrar profesores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Filtrar por materia"
            value={filters.subject}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Filtrar por país"
            value={filters.country}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Precio máximo por hora"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <select
            name="languageLevel"
            value={filters.languageLevel}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Todos los niveles de idioma</option>
            <option value="native">Nativo</option>
            <option value="verified">Verificado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))
        ) : (
          <p>No se encontraron profesores que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
