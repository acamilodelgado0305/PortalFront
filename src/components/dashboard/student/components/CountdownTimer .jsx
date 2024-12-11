import { useEffect, useState } from 'react';

const CountdownTimer = ({ classDate, classTime }) => {
  if(!classDate || classTime) {
    return null
  }
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const [day, month, year] = classDate.split('/').map(Number);
      const [time, period] = classTime.split(' ');
      const [hour, minute] = time.split(':').map(Number);

      const isPM = period === 'PM';
      const finalHour = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);

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

        if (minutesLeft > 40) {
          setTimeRemaining(null);
        } else if (daysLeft === 0 && hoursLeft === 0 && minutesLeft < 45) {
          setIsCountdownActive(true);
          setTimeRemaining(`Faltan menos de 45 minutos: ${minutesLeft} minutos`);
        } else {
          setIsCountdownActive(false);
          if (daysLeft === 0) {
            setTimeRemaining(`Hoy, faltan ${hoursLeft} horas y ${minutesLeft} minutos.`);
          } else {
            setTimeRemaining(`${daysLeft} días, ${hoursLeft} horas y ${minutesLeft} minutos restantes.`);
          }
        }
      }
    }, 1000);  

    return () => clearInterval(interval); 
  }, [classDate, classTime]);

  useEffect(() => {
    if (isCountdownActive) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const [day, month, year] = classDate.split('/').map(Number);
          const [time, period] = classTime.split(' ');
          const [hour, minute] = time.split(':').map(Number);

          const isPM = period === 'PM';
          const finalHour = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);

          const classDateTime = new Date(year, month - 1, day, finalHour, minute);
          const currentDate = new Date();
          const timeDiff = classDateTime - currentDate;

          if (timeDiff <= 0) {
            clearInterval(interval);
            return 'La clase ya pasó.';
          } else {
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            return `Faltan ${minutesLeft} minutos.`;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCountdownActive]);

  return (
    <div className="text-center py-4 px-6 rounded-md bg-blue-200 shadow-lg">
      <h3 className="text-xl font-semibold">Tiempo restante para la clase:</h3>
      {timeRemaining && <p className="mt-2 text-lg">{timeRemaining}</p>}
    </div>
  );
};

export default CountdownTimer;
