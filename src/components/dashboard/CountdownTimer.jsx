import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountdownTimer.css';

const CountdownTimer = ({ nextClassId, classDate }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isRedirectButtonVisible, setIsRedirectButtonVisible] = useState(false);
  const [ isText, setIsText ] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const classDateTime = new Date(classDate);
      const currentDate = new Date();
      const timeDiff = classDateTime - currentDate;

      if (timeDiff <= 0) {
        const timePassed = Math.abs(timeDiff);

        if (timePassed <= 60 * 60 * 1000) {
          setTimeRemaining('En clase...');
          setIsRedirectButtonVisible(true);
        } else {
          setTimeRemaining('Clase finalizada.');
          setIsRedirectButtonVisible(false);
        }
        clearInterval(interval);
      } else {
        const totalMinutesLeft = Math.floor(timeDiff / (1000 * 60));
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (totalMinutesLeft < 60) {
          setTimeRemaining(
            `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
          );
          setIsText(false)
        } else {
          setTimeRemaining(
            `Faltan ${daysLeft} día(s) y ${hoursLeft} hora(s).`
          );
          setIsText(true)
        }

        setIsRedirectButtonVisible(totalMinutesLeft <= 15 && totalMinutesLeft < 60);
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
        <h3 className={`${!isText ? 'text-lg':'text-xs'} font-semibold text-[#a14eec]`}>Tiempo restante para la clase:</h3>
        {/* Cuando tiene texto que la letra se mas chiquita! */}
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
