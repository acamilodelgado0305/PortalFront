import { useState } from 'react';
import { Button, Card, List, Tag } from 'antd';  // Usamos componentes de Ant Design
import { MessageOutlined } from '@ant-design/icons';  // Para los íconos de chat (reemplazo del ícono no disponible)
import { Link } from 'react-router-dom';  // Para los enlaces

// Datos de ejemplo (estos datos deben provenir de tu API o base de datos)
const students = [
    { id: 1, name: 'Juan Pérez', grade: 85, status: 'Aprobado' },
    { id: 2, name: 'Ana Gómez', grade: 58, status: 'Por Aprobar' },
    { id: 3, name: 'Carlos López', grade: 45, status: 'Por Aprobar' },
    { id: 4, name: 'María Sánchez', grade: 92, status: 'Aprobado' },
    { id: 5, name: 'Pedro García', grade: 72, status: 'Aprobado' },
];

// Lista de estudiantes que necesitan aprobar
const studentsToApprove = students.filter(student => student.status === 'Por Aprobar');

const TeacherDashboard = () => {
    const [activeSection, setActiveSection] = useState('teachers');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);

    const handleViewClass = (classId) => {
        setSelectedTeacherId(classId);
        setActiveSection('classDetail');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Encabezado */}
            <div className="w-full sticky top-0 bg-gradient-to-r from-purple-600 to-purple-400 p-6 text-white shadow-md">
                <h1 className="text-3xl font-semibold text-center">Bienvenido al Dashboard del Profesor</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-8 space-y-6">
                {/* Botón para ir a la pizarra */}
                <div className="flex justify-center">
                    <Link to="/whiteboard/:room">
                        <Button className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
                            Ir a la Pizarra
                        </Button>
                    </Link>
                </div>

                {/* Sección de clases */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">Tus Clases</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((classItem) => (
                            <Card key={classItem.id} className="shadow-md hover:shadow-lg transition-all">
                                <div className="flex flex-col p-4">
                                    <span className="text-lg font-semibold">{classItem.name}</span>
                                    <span className="text-gray-600">{classItem.grade} - {classItem.status}</span>
                                    <Link to={`/clase/${classItem.id}`} className="text-purple-500 hover:underline mt-2">
                                        Ver detalles
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sección de estudiantes por aprobar */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">Estudiantes por Aprobar</h2>
                    {studentsToApprove.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={studentsToApprove}
                            renderItem={(student) => (
                                <List.Item
                                    key={student.id}
                                    actions={[<Link to={`/student/${student.id}`} className="text-purple-500 hover:underline">Ver detalles</Link>]}>
                                    <List.Item.Meta
                                        title={student.name}
                                        description={`Calificación: ${student.grade}`}
                                    />
                                    <Tag color="red">{student.status}</Tag>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <p>No hay estudiantes por aprobar.</p>
                    )}
                </div>

                {/* Sección de Chat con Estudiantes */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">Chat con Estudiantes</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <MessageOutlined className="text-purple-600 w-6 h-6" />
                            <span className="text-lg font-semibold">Juan Pérez</span>
                            <p className="text-gray-500">¿Puedo preguntar sobre el examen?</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <MessageOutlined className="text-purple-600 w-6 h-6" />
                            <span className="text-lg font-semibold">Ana Gómez</span>
                            <p className="text-gray-500">¿Cuándo es la próxima clase?</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <MessageOutlined className="text-purple-600 w-6 h-6" />
                            <span className="text-lg font-semibold">Carlos López</span>
                            <p className="text-gray-500">Necesito ayuda con los ejercicios de matemáticas.</p>
                        </div>
                        {/* Aquí podrías agregar un formulario de chat si lo necesitas */}
                    </div>
                    <Button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
                        Enviar Mensaje
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
