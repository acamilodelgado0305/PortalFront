export const getUpcomingClasses = (classList) => {
  const currentDate = new Date();
  const upcomingClasses = classList.filter(classItem => {
    const classDate = new Date(classItem.hours);
    
  
    return classDate >= currentDate;
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
  