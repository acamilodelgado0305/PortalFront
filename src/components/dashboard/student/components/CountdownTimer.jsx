import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CountdownTimer = ({ nextClassId, classDate }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isRedirectButtonVisible, setIsRedirectButtonVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const classDateTime = new Date(classDate);  // classDate debe ser una cadena ISO
      const currentDate = new Date();
      const timeDiff = classDateTime - currentDate;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeRemaining('La clase ya empezó.');
        setIsRedirectButtonVisible(true);
      } else {
        const minutesLeft = Math.floor(timeDiff / (1000 * 60));
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Mostrar el tiempo restante solo si faltan menos de 45 minutos
        if (minutesLeft <= 45 && minutesLeft >= 0) {
          setTimeRemaining(`Faltan ${minutesLeft} minutos y ${secondsLeft} segundos.`);
        } else {
          setTimeRemaining('');
        }

        // Mostrar el botón solo si faltan menos de 15 minutos
        if (minutesLeft <= 15) {
          setIsRedirectButtonVisible(true);
        } else {
          setIsRedirectButtonVisible(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classDate]);

  const handleGoToWhiteboard = () => {
    navigate("/whiteboard/" + nextClassId);
  };

  return (
    timeRemaining && (
      <div className="text-center py-4 px-6 rounded-md bg-[#9333ea40] shadow-lg mt-3">
        <h3 className="text-lg font-semibold">Tiempo restante para la clase:</h3>
        <p className="mt-2 text-lg text-[#9333ea]">{timeRemaining}</p>
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
