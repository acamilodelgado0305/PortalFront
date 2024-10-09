import React from 'react';

const subjects = [
  { name: 'Matemáticas', icon: '📊' },
  { name: 'Alemán', icon: '🇩🇪' },
  { name: 'Física', icon: '🔬' },
  { name: 'Inglés', icon: '🇬🇧' },
  { name: 'Química', icon: '⚗️' },
  { name: 'Economía', icon: '🏛️' },
  { name: 'Francés', icon: '🇫🇷' },
  { name: 'Latín', icon: '🏛️' },
  { name: 'Biología', icon: '🌱' },
  { name: 'Lengua y Literatura', icon: '📚' },
  { name: 'Italiano', icon: '🇮🇹' },
  { name: 'Geografía', icon: '🌍' },
];

const Subject = () => {
  return (
    <div className="bg-white h-auto w-full">
      <div className="max-w-screen-lg mx-auto ">

      <div className="text-center mb-8 ">
        <h2 className="text-4xl font-bold text-[#3b82f6]">Asignaturas más solicitadas</h2>
        <p className="mt-2"> Matemáticas, Física... Recibe clases particulares de apoyo en más de 30 asignaturas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 border border-blue-800 rounded-md shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">{subject.icon}</div>
            <p className="text-blue-600 font-semibold">{subject.name}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a href="#"
           className="text-blue-600 underline flex items-center justify-center"
        >
          Ver todas las asignaturas <span className="ml-1">⬇️</span>
        </a>
      </div>
    </div>

      </div>
  );
};

export default Subject;
