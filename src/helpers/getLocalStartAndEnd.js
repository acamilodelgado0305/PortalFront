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


export const getLocalTimeWithTimezone = (date, time) => {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Obtiene la zona horaria local

  // Divide la fecha en día, mes y año
  const [day, month, year] = date.split("/").map(Number);

  // Divide la hora en horas, minutos y AM/PM
  const [timePart, meridiem] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convierte la hora a formato de 24 horas si es necesario
  if (meridiem === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  // Crea una nueva fecha combinando la fecha y la hora
  const combinedDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  // Ajusta la hora a la zona horaria local
  const localTime = combinedDate.toLocaleString("en-US", { timeZone: localTimezone });

  return new Date(localTime).toISOString();
};


export const  convertToLocalTime =(isoString)=> {
  const date = new Date(isoString); // Convierte la cadena ISO a un objeto Date
  const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Formato AM/PM
  };
  return date.toLocaleTimeString(undefined, options); // Devuelve la hora local
}
