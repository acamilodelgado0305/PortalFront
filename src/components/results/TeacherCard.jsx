import React, { useState } from 'react';
import { getFlagUrl } from "../../services/allcountries.js" 
import { Play, X } from 'lucide-react';


const TeacherCard = ({ teacher, onVideoClick }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price * 1000);
  };


  const getYouTubeThumbnail = (url) => {
    const videoId = url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const ScheduleModal = ({ availability, onClose }) => {
    const days = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo'
    };

    function convertToLocalTime(startISO, endISO) {
      const startDate = new Date(startISO);
      const endDate = new Date(endISO);
      
      const localStartTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const localEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return `${localStartTime} - ${localEndTime}`;
  }  

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 py-6">
        <div className="bg-white rounded-lg w-full max-w-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Horario disponible</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {Object.entries(availability || {}).map(([day, data]) => {
                if (!data.enabled) return null;
                return (
                  <div key={day} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-3">{days[day]}</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.timeSlots.map((slot, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {convertToLocalTime(slot.start, slot.end)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative group">
      {/* Tarjeta Principal */}
      <div className="h-[37vh] w-[50%] lg:w-[100%] bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-black  overflow-hidden">
        <div className="flex gap-6">
          {/* Columna izquierda con imagen */}
          <div className="w-32">
            <img
              src={teacher.profileImageUrl}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-32 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128x128';
              }}
            />
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              {/* Información del profesor */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-medium">
                 {teacher.firstName} {teacher.lastName} 
                  </h3>
                  <div className="flex items-center">  
                    <img src={getFlagUrl(teacher.countryOfBirth)} style={{width:'20px', heigth:'20px'}} className='mx-2'/>
                    <span className="text-yellow-400">★</span>
                  
                    <span className="font-medium">{teacher.rating || 5}</span>
                    <span className="text-gray-600 text-sm ml-1">
                      ({teacher.reviews || 3} opiniones)
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-1">{teacher.subjectYouTeach}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <span>{teacher.activeStudents || 3} estudiantes activos</span>
                    <span className="mx-2">•</span>
                    <span>{teacher.lessonsGiven || 162} lecciones</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>
                    Habla {teacher.language} ({teacher.languageLevel === 'native' ? 'Nativo' : 'Avanzado'})
                  </span>

                </div>
              </div>

              {/* Precio */}
              <div className="text-right">
              <p className="text-xl font-semibold text-gray-900">
                  {formatPrice(teacher.hourlyRate)}
                </p>
                <p className="text-sm text-gray-500">Lección de 50 minutos</p>
              </div>
            </div>
            <div className="text-gray-700 w-[50%] absolute">
                {teacher.description?.introduction}
              </div>
            {/* Botones */}
            <div className="flex flex-col w-[56em] gap-3 text-right justify-end items-end">
              <button
                onClick={() => console.log('Clase de prueba gratuita')}
                className="w-[12em] bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
              >
                Clase de prueba gratuita
              </button>

              <button
                onClick={() => console.log('Enviar mensaje')}
                className="w-[12em] border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista previa del video flotante */}
      <div className="absolute top-0 left-[30%] lg:left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="h-[37vh] border border-black !border-black bg-white rounded-lg shadow-lg p-3 w-[27em] h-[17em]">
          <div
            className={` relative w-full h-[15em] bg-gray-100 rounded-lg ${teacher.video ? 'cursor-pointer' : ''} overflow-hidden`}
            onClick={() => teacher.video && onVideoClick(teacher.video)}
          >
            {teacher.video ? (
              <>
                <img
                  src={getYouTubeThumbnail(teacher.video)}
                  alt="Vista previa del video"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-200">
                  <Play
                    size={48}
                    className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <Play size={48} className="mb-2 opacity-50" />
                <span className="text-sm">Video no disponible</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScheduleModal(true);
              }}
              className="w-[12em] mt-3 text-center text-white hover:text-gray-900 text-sm font-medium bg-purple-500 rounded px-4 py-2"
            >
              Ver horario completo
            </button>
          </div>
        </div>
      </div>


      {/* Modal del horario */}
      {showScheduleModal && (
        <ScheduleModal
          availability={teacher.Availability}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherCard;