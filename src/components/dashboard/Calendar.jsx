import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Card, Badge, Button, Modal, Space, Tag, Typography, Alert, Tooltip } from 'antd';
import { 
    CalendarOutlined, 
    UserOutlined, 
    BookOutlined, 
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getClassesByTeacherId, getClassesByStudentId } from '../../services/class.services';
import { formatCalendarData, formatCalendarTeacherData } from '../../helpers';
moment.locale('es');
const localizer = momentLocalizer(moment);
const { Title, Text } = Typography;

const Calendario = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchScheduledClasses = async () => {
            let result;
            let simulatedEvents;
            if(user.role == 'student') {
               result = await getClassesByStudentId(user.id);
                simulatedEvents = formatCalendarData(result.data);
               
           
            } else if(user.role == 'teacher') {
                result = await getClassesByTeacherId(user.id);
                simulatedEvents = formatCalendarTeacherData(result.data);
                console.log('simulatedEvents \n')
                console.log(JSON.stringify(simulatedEvents))
            } else {
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
            setEvents(simulatedEvents);
        };

        fetchScheduledClasses();
    }, [user.id]);

    const eventStyleGetter = (event) => {
        let style = {
            backgroundColor: '#1890ff',
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block'
        };

        if (event.status === 'pendiente') {
            style.backgroundColor = '#faad14';
        } else if (event.status === 'confirmada') {
            style.backgroundColor = '#52c41a';
        }

        return { style };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const getStatusBadge = (status) => {
        return status === 'confirmada' ? (
            <Badge status="success" text="Confirmada" />
        ) : (
            <Badge status="warning" text="Pendiente" />
        );
    };

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space align="center">
                    <CalendarOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                        Calendario de Clases Agendadas
                    </Title>
                </Space>

                <Alert
                    message="Información"
                    description="Las clases en amarillo están pendientes de confirmación. Las clases en verde ya están confirmadas."
                    type="info"
                    showIcon
                />

                <div style={{ height: 600 }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={handleSelectEvent}
                        style={{ height: '100%' }}
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
                            noEventsInRange: 'No hay clases programadas en este período'
                        }}
                    />
                </div>
            </Space>

            <Modal
                title={
                    <Space>
                        <BookOutlined />
                        <span>Detalles de la Clase</span>
                    </Space>
                }
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="cancel" onClick={handleModalClose}>
                        Cerrar
                    </Button>,
                    <Button 
                        key="edit" 
                        type="primary" 
                        icon={<EditOutlined />}
                    >
                        Modificar
                    </Button>,
                    <Button 
                        key="delete" 
                        danger 
                        icon={<DeleteOutlined />}
                    >
                        Cancelar Clase
                    </Button>
                ]}
            >
                {selectedEvent && (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Space>
                            <UserOutlined />
                            <Text strong>{selectedEvent.studentName}</Text>
                        </Space>
                        
                        <Space>
                            <BookOutlined />
                            <Text>
                                {selectedEvent.subject}
                                <Tag color="blue" style={{ marginLeft: 8 }}>
                                    {selectedEvent.level}
                                </Tag>
                            </Text>
                        </Space>

                        <Space>
                            <ClockCircleOutlined />
                            <Text>
                                {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')} - 
                                {moment(selectedEvent.end).format('HH:mm')}
                            </Text>
                        </Space>

                        <div>
                            {getStatusBadge(selectedEvent.status)}
                        </div>
                    </Space>
                )}
            </Modal>
        </Card>
    );
};

export default Calendario;