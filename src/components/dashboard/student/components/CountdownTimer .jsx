import { useEffect, useState } from 'react';

const CountdownTimer = ({ classDate, classTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isCountdownActive, setIsCountdownActive] = useState(false);

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
      } else {
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (minutesLeft < 45) {
          setIsCountdownActive(true); // Mostrar cartel solo cuando falta menos de 45 minutos
          setTimeRemaining(`Faltan ${minutesLeft} minutos y ${secondsLeft} segundos.`);
        } else {
          setIsCountdownActive(false);
          if (daysLeft === 0) {
            setTimeRemaining(`Hoy, faltan ${hoursLeft} horas, ${minutesLeft} minutos y ${secondsLeft} segundos.`);
          } else {
            setTimeRemaining(`${daysLeft} días, ${hoursLeft} horas, ${minutesLeft} minutos y ${secondsLeft} segundos restantes.`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classDate, classTime]);

  return (
    <div className="text-center py-4 px-6 rounded-md bg-[#9333ea40] shadow-lg mt-1">
      <h3 className="text-xl font-semibold">Tiempo restante para la clase:</h3>
      {timeRemaining && <p className="mt-2 text-lg">{timeRemaining}</p>}
    </div>
  );
};

export default CountdownTimer;

