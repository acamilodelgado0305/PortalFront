import { useState, useEffect } from 'react';
import { CalendarOutlined } from '@ant-design/icons';

function DaysOfWeek({ Availability }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(window.innerWidth < 750 || window.innerWidth > 1040);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible((window.innerWidth < 750 || window.innerWidth > 1040 ));

    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDayClick = (day) => {
    console.log(`Mostrar horarios para ${day}`);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex items-center space-x-4 py-6 md:py-2 md:px-6">
      {isVisible && (
        <>
          {Object.keys(Availability).map((day) => (
            <div
              key={day}
              className={`text-center cursor-pointer ${Availability[day].enabled ? 'text-purple-600' : 'text-gray-400'}`}
              onClick={() => {
                if (Availability[day].enabled) {
                  handleDayClick(day);
                }
              }}
            >
              {day.substr(0, 3)}
            </div>
          ))}
        </>
      )}

      {/* Icono de calendario solo si la pantalla es mayor a 1040px */}

        <CalendarOutlined
          className="text-purple-600 cursor-pointer hover:text-purple-800"
          style={{ fontSize: '24px' }}
          onClick={toggleModal}
        />
 

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Disponibilidad</h2>
            <div>
              {Object.keys(Availability).map((day) => (
                Availability[day].enabled && (
                  <div key={day} className="mb-2">
                    <p className="font-semibold">{day}</p>
                    {/* Aquí mostramos los timeSlots si hay alguno */}
                    {Availability[day].timeSlots.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {Availability[day].timeSlots.map((slot, index) => (
                          <li key={index}>
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay horarios disponibles.</p>
                    )}
                  </div>
                )
              ))}
            </div>
            <button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800"
              onClick={toggleModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DaysOfWeek;
