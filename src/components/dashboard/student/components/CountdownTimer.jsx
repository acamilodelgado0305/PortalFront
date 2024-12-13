import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountdownTimer.css'; // Importar el CSS para la fuente

const CountdownTimer = ({ nextClassId, classDate }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isRedirectButtonVisible, setIsRedirectButtonVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const classDateTime = new Date(classDate); // classDate debe ser una cadena ISO
      const currentDate = new Date();
      const timeDiff = classDateTime - currentDate;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeRemaining('00:00');
        setIsRedirectButtonVisible(true);
      } else {
        const minutesLeft = String(Math.floor(timeDiff / (1000 * 60))).padStart(2, '0');
        const secondsLeft = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
        setTimeRemaining(`${minutesLeft}:${secondsLeft}`);

        if (Math.floor(timeDiff / (1000 * 60)) <= 15) {
          setIsRedirectButtonVisible(true);
        } else {
          setIsRedirectButtonVisible(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classDate]);

  const handleGoToWhiteboard = () => {
    navigate('/whiteboard/' + nextClassId);
  };

  return (
    timeRemaining && (
      <div className="text-center py-3 px-6 rounded-md bg-[#9333ea66] shadow-lg mt-3">
        <h3 className="text-lg font-semibold text-[#a14eec]">Tiempo restante para la clase:</h3>
        <p className="mt-2 digital-clock">{timeRemaining}</p>
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
