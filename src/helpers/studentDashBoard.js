export const getUpcomingClasses = (classList) => {
  const currentDate = new Date();
  const upcomingClasses = classList.filter(classItem => {
    const classDate = new Date(classItem.hours);
    
  
    return classDate >= currentDate;
  });

  return sortClassesByDate(upcomingClasses);
};
export const getActiveClasses = (classList) => {
  const currentDate = new Date();  // Obtener la fecha actual
  console.log("Fecha actual: ", currentDate);

  const activeClasses = classList.filter(classItem => {
    const classDate = new Date(classItem.hours);  // Fecha de la clase en formato ISO
    console.log("Fecha classDate: ", classDate);
    // Calcular la fecha límite de 60 minutos desde el inicio de la clase
    const endClassDate = new Date(classDate);
    endClassDate.setMinutes(classDate.getMinutes() + 60);

    // Verificar si la clase está activa (pasó el inicio pero no más de 60 minutos)
    return currentDate >= classDate && currentDate <= endClassDate;
  });

  console.log('Clases activas: ', activeClasses);
  return activeClasses;
};

export const hasClassEnded = (classItem) => {
  const currentDate = new Date();  
  const classDate = new Date(classItem.hours);  

  const endClassDate = new Date(classDate);
  endClassDate.setMinutes(classDate.getMinutes() + 60);

  return currentDate > endClassDate;
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
  