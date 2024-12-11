export const getUpcomingClasses = (classList) => {
    const currentDate = new Date();
  
    const upcomingClasses = classList.filter(classItem => {
      const [day, month, year] = classItem.date.split("/").map(Number);
      const classDate = new Date(year, month - 1, day); 
  
      return classDate > currentDate; 
    });
  
    return sortClassesByDate(upcomingClasses);
  };
  
  export const sortClassesByDate = (classList) => {
    return classList.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);
  
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
  
      return dateA - dateB; 
    });
  };
  
  export const getNextClass = (classList) => {
    const upcomingClasses = getUpcomingClasses(classList);
    
    return upcomingClasses.length > 0 ? upcomingClasses[0] : null;
  };
  
  export const getTimeRemaining = (classDate, classTime) => {
    console.log('classDate ' + classDate);
    console.log('classDateTime ' + classTime);
  
    const [day, month, year] = classDate.split('/').map(Number);
    
    // Se hace un split del tiempo y manejo AM/PM
    const [time, period] = classTime.split(' ');  // Divide '7:30' y 'AM/PM'
    const [hour, minute] = time.split(':').map(Number);  // Divide '7' y '30'
  
    // Convertir la hora de formato AM/PM a 24 horas
    const isPM = period === 'PM';
    const finalHour = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
  
    const classDateTime = new Date(year, month - 1, day, finalHour, minute);
  
    const currentDate = new Date();
    const timeDiff = classDateTime - currentDate;
  
    if (timeDiff <= 0) {
      return 'La clase ya pasó.';
    }
  
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 
    const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
  
    if (daysLeft === 0) {
      return `Hoy, faltan ${hoursLeft} horas.`;
    } else {
      return `${daysLeft} días y ${hoursLeft} horas restantes.`;
    }
  };
  