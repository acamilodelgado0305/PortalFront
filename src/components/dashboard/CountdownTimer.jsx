import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import {FaChalkboardTeacher } from "react-icons/fa";
import './CountdownTimer.css';

const CountdownTimer = ({ nextClassId, classDate }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isRedirectButtonVisible, setIsRedirectButtonVisible] = useState(false);
  const [isText, setIsText] = useState(false);
  const [totalMinutesLeft, setTotalMinutesLeft] = useState(0); // Añadir un estado para almacenar los minutos restantes

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
          setIsText(true);
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

        setTotalMinutesLeft(totalMinutesLeft);

        if (totalMinutesLeft < 60) {
          setTimeRemaining(
            `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
          );
          setIsText(false);
        } else {
          setTimeRemaining(
            `Faltan ${daysLeft} día(s) y ${hoursLeft} hora(s).`
          );
          setIsText(true);
        }

        setIsRedirectButtonVisible(totalMinutesLeft <= 15 && totalMinutesLeft < 60);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classDate]);

  const handleGoToWhiteboard = () => {
    if (totalMinutesLeft > 15) { 
      notification.warning({
        message: 'Advertencia',
        description: 'Quedan más de 15 minutos para la clase.',
        duration: 3,
      });
    } else {
      navigate('/whiteboard/' + nextClassId);
    }
  };

  return (
    timeRemaining && (
      <div className="flex flex-col  flex-col items-center justify-center py-3 px-6 rounded-md bg-[#9333ea66] shadow-lg mt-3">
        <h3 className={`text-lg font-semibold text-[#a14eec]`}>Tiempo restante para la clase:</h3>
        <p className={`${!isText ? 'text-[2.3rem]' : 'text-lg'} mt-2 digital-clock`}>{timeRemaining}</p>
        <button
          onClick={handleGoToWhiteboard}
          className="rounded-lg bg-purple-500 px-6 py-1 text-white items-center justify-center shadow-md transition-all hover:bg-purple-700 mt-1 flex gap-3"
        >
          Ir a la Pizarra <FaChalkboardTeacher/>
        </button>
      </div>
    )
  );
};

export default CountdownTimer;
