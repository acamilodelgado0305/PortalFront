import React, { useState, useEffect } from 'react';
import { readAllTeachers } from '../../services/teacher.services';
import Header from '../Header';

function Results() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await readAllTeachers();
        setTeachers(data.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los profesores');
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>;
  if (error) return <div className="text-red-600 text-center text-xl p-4">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Todos los Profesores</h1>
          <p className="mt-2 text-xl">Explora nuestra selección completa de docentes</p>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        {teachers.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No se encontraron profesores disponibles.</p>
        ) : (
          <ul className="space-y-4">
            {teachers.map(teacher => (
              <li key={teacher.id} className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
                <img
                  src={teacher.profileImageUrl || '/api/placeholder/400/400'}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{teacher.firstName} {teacher.lastName}</h2>
                    <p className="text-gray-600">Tarifa: <span className="font-semibold">${teacher.hourlyRate}</span></p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{teacher.description.headline}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => openModal(teacher)}
                  >
                    Ver Video
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedTeacher.firstName} {selectedTeacher.lastName} - Video</h2>
            <video controls className="w-full">
              <source src={selectedTeacher.videoUrl} type="video/mp4" />
              Lo siento, tu navegador no soporta videos.
            </video>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
