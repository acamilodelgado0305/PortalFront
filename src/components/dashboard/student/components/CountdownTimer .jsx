import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CountdownTimer = ({ nextClassId, classDate, classTime }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isRedirectButtonVisible, setIsRedirectButtonVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const [day, month, year] = classDate.split('/').map(Number);
      const [time, period] = classTime.split(' ');
      const [hour, minute] = time.split(':').map(Number);

      // Ajustar la hora si es PM o AM
      let finalHour = hour;
      if (period === 'PM' && hour !== 12) {
        finalHour = hour + 12; // Si es PM, sumar 12 a la hora (excepto si ya es 12 PM)
      } else if (period === 'AM' && hour === 12) {
        finalHour = 0; // Si es 12 AM, poner la hora en 0
      }

      const classDateTime = new Date(year, month - 1, day, finalHour, minute);
      const currentDate = new Date();
      const timeDiff = classDateTime - currentDate;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeRemaining('La clase ya pasó.');
        setIsCountdownActive(false); // Dejar de mostrar el contador cuando ya pasó
        setIsRedirectButtonVisible(false); // Asegurarse de que el botón se oculte
      } else {
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Mostrar solo si faltan menos de 45 minutos
        if (minutesLeft < 45) {
          setIsCountdownActive(true);
          setTimeRemaining(`Faltan ${minutesLeft} minutos y ${secondsLeft} segundos.`);

          // Mostrar el botón si faltan menos de 20 minutos
          if (minutesLeft < 20) {
            setIsRedirectButtonVisible(true);
          } else {
            setIsRedirectButtonVisible(false);
          }
        } else {
          setIsCountdownActive(false); // Si faltan más de 45 minutos, ocultar el temporizador
          setIsRedirectButtonVisible(false); // Asegurarse de que el botón esté oculto
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classDate, classTime]);

  const handleGoToWhiteboard = () => {
    navigate("/whiteboard/"+nextClassId); 
  };

  return (
    isCountdownActive && (  // Solo mostrar cuando falten menos de 45 minutos
      <div className="text-center py-4 px-6 rounded-md bg-[#9333ea40] shadow-lg mt-1">
        <h3 className="text-xl font-semibold">Tiempo restante para la clase:</h3>
        {timeRemaining && <p className="mt-2 text-lg">{timeRemaining}</p>}
        {isRedirectButtonVisible && (
          <button
            onClick={handleGoToWhiteboard}
            className="rounded-lg bg-purple-500 px-6 py-1 text-white shadow-md transition-all hover:bg-purple-700 mt-1"
          >
            Ir a la Pizarra
          </button>
        )}
      </div>
    )
  );
};

export default CountdownTimer;
