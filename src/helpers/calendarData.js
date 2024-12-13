export const formatCalendarData = (data) => {
    return data.map((classData) => {
        const { teacher, hours, id, status } = classData;
        return {
            id, // ID de la clase
            title: `Clase con ${teacher.firstName} ${teacher.lastName}`, // Título dinámico
            start: new Date(hours.start), // Hora de inicio
            end: new Date(hours.end), // Hora de fin
            studentName: `${teacher.firstName} ${teacher.lastName}`, // Nombre del profesor
            subject: teacher.subjectYouTeach, // Materia que enseña el profesor
            level: teacher.languageLevel, // Nivel de idioma del profesor
            status: status ? 'confirmada' : 'pendiente' // Estado de la clase
        };
    });
};

export const formatCalendarTeacherData = (data) => {
    return data.map((classData) => {
        const { student, hours, id, status } = classData;

        if (!student || !hours || !id) {
            console.warn('Datos incompletos para procesar la clase:', classData);
            return null; 
        }

        return {
            id, // ID de la clase
            title: `Clase con ${student.nombre} ${student.apellido}`, 
            start: new Date(hours.start), 
            end: new Date(hours.end),
            studentName: `${student.nombre} ${student.apellido}`, 
            subject: 'materia', 
            level: '', 
            status: status ? 'confirmada' : 'pendiente', 
        };
    }).filter(Boolean);
};

