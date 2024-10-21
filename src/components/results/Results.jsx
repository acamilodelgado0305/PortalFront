import { useState, useEffect } from 'react';
//import { readAllTeachers } from '../../services/teacher.services';
import Header from '../Header';
import TeacherList from './TeacherList';
import VideoModal from './VideoModal';


function Results() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('https://back.app.esturio.com/api/teachers');
        const data = await response.json();
        setTeachers(data.data);
        setLoading(false);
        console.log("teacher datos", data.data);
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
      <header className="bg-purple-500 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Todos los Profesores</h1>
          <p className="mt-2 text-xl">Explora nuestra selección completa de docentes</p>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        {Array.isArray(teachers) && teachers.length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            No se encontraron profesores disponibles.
          </p>
        ) : (
          Array.isArray(teachers) && teachers.length > 0 ? (
            <TeacherList teachers={teachers} openModal={openModal} />
          ) : (
            <p className="text-center text-xl text-red-600">
              Error cargando los profesores.
            </p>
          )
        )}
      </main>
      {isModalOpen && selectedTeacher && (
        <VideoModal selectedTeacher={selectedTeacher} closeModal={closeModal} />
      )}
    </div>
  );
}

export default Results;
