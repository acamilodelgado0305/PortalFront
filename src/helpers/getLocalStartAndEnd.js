export const getLocalStartAndEnd = (utcTimes) => {

  const { start, end } = utcTimes;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startLocal = new Date(start).toLocaleTimeString(undefined, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const endLocal = new Date(end).toLocaleTimeString(undefined, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });


  return { start: startLocal, end: endLocal };
};


export const getLocalTimeWithTimezone =(time)=> {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Obtiene la zona horaria local
  const currentDate = new Date(); // Fecha actual

  // Divide la hora en horas, minutos y AM/PM
  const [timePart, meridiem] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convierte a formato de 24 horas si es necesario
  if (meridiem === "PM" && hours !== 12) {
      hours += 12;
  } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
  }

  currentDate.setHours(hours, minutes, 0, 0);

  return currentDate.toISOString()
}