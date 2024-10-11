// Results.js
import React, { useState, useEffect } from 'react';
import { readAllTeachers } from '../../services/teacher.services';
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
          <TeacherList teachers={teachers} openModal={openModal} />
        )}
      </main>
      {isModalOpen && selectedTeacher && (
        <VideoModal selectedTeacher={selectedTeacher} closeModal={closeModal} />
      )}
    </div>
  );
}

export default Results;
