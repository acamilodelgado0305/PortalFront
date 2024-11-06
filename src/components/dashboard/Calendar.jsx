import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendario = ({ teacherId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Simulación de datos de clases agendadas
        const fetchScheduledClasses = async () => {
            // Aquí iría la llamada a la API para obtener las clases del profesor
            const simulatedEvents = [
                {
                    id: 1,
                    title: 'Clase con Juan Pérez',
                    start: new Date(2024, 10, 10, 10, 0),
                    end: new Date(2024, 10, 10, 11, 0),
                },
                {
                    id: 2,
                    title: 'Clase con Ana Gómez',
                    start: new Date(2024, 10, 12, 14, 0),
                    end: new Date(2024, 10, 12, 15, 0),
                },
                {
                    id: 3,
                    title: 'Clase con Carlos Ruiz',
                    start: new Date(2024, 10, 15, 16, 0),
                    end: new Date(2024, 10, 15, 17, 0),
                },
                {
                    id: 4,
                    title: 'Clase con Luisa Martínez',
                    start: new Date(2024, 10, 20, 9, 0),
                    end: new Date(2024, 10, 20, 10, 0),
                },
            ];
            setEvents(simulatedEvents);
        };

        fetchScheduledClasses();
    }, [teacherId]);

    return (
        <div style={{ height: '80vh', padding: '20px' }}>
            <h2>Calendario de Clases Agendadas</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                messages={{
                    next: 'Siguiente',
                    previous: 'Anterior',
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    agenda: 'Agenda',
                    date: 'Fecha',
                    time: 'Hora',
                    event: 'Evento',
                }}
            />
        </div>
    );
};

export default Calendario;
