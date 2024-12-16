export const formatCalendarData = (data) => {
    return data.map((classData) => {
        const { teacher, hours, id, status } = classData;


        const start = new Date(hours);
        
        if (isNaN(start)) {
            console.warn('Fecha de inicio no válida:', classData);
            return null;
        }

        const end = new Date(start);
        end.setHours(start.getHours() + 1); 


        return {
            id, // ID de la clase
            title: `Clase con ${teacher.firstName} ${teacher.lastName}`, // Título dinámico
            start: start, // Hora de inicio
            end: end, // Hora de fin
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

        const start = new Date(hours);
        
        if (isNaN(start)) {
            console.warn('Fecha de inicio no válida:', classData);
            return null;
        }

        const end = new Date(start);
        end.setHours(start.getHours() + 1); 

        return {
            id, // ID de la clase
            title: `Clase con ${student.nombre} ${student.apellido}`, 
            start: start, 
            end: end,
            studentName: `${student.nombre} ${student.apellido}`, 
            subject: 'materia', 
            level: '', 
            status: status ? 'confirmada' : 'pendiente', 
        };
    }).filter(Boolean); // Remove null entries
};


/* Recuerda que deve devolver algo con el mismo formato que esto:

        simulatedEvents = [
                {
                    id: 1,
                    title: 'Clase con Juan Pérez',
                    start: new Date(2024, 10, 10, 10, 0),
                    end: new Date(2024, 10, 10, 11, 0),
                    studentName: 'Juan Pérez',
                    subject: 'Matemáticas',
                    level: 'Intermedio',
                    status: 'confirmada'
                },
                {
                    id: 2,
                    title: 'Clase con Ana Gómez',
                    start: new Date(2024, 10, 12, 14, 0),
                    end: new Date(2024, 10, 12, 15, 0),
                    studentName: 'Ana Gómez',
                    subject: 'Física',
                    level: 'Avanzado',
                    status: 'pendiente'
                },
                {
                    id: 3,
                    title: 'Clase con Carlos Ruiz',
                    start: new Date(2024, 10, 15, 16, 0),
                    end: new Date(2024, 10, 15, 17, 0),
                    studentName: 'Carlos Ruiz',
                    subject: 'Química',
                    level: 'Básico',
                    status: 'confirmada'
                },
                {
                    id: 4,
                    title: 'Clase con Luisa Martínez',
                    start: new Date(2024, 10, 20, 9, 0),
                    end: new Date(2024, 10, 20, 10, 0),
                    studentName: 'Luisa Martínez',
                    subject: 'Biología',
                    level: 'Intermedio',
                    status: 'pendiente'
                },
            ];}



*/