import { useState, useEffect } from 'react';
import { Button, Card, List, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getClassesByTeacherId, updateClassById } from "../../../services/class.services.js";
import { useAuth } from '../../../Context/AuthContext.jsx';

const TeacherDashboard = () => {
    const [activeSection, setActiveSection] = useState('teachers');
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);

    const handleViewClass = (classId) => {
        setActiveSection('classDetail');
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const result = await getClassesByTeacherId(user.id);
                if (result.success) {
                    setClasses(result.data);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, [user.id]);

    const approveStudent = async (classId) => {
        try {
            const data = { status: true };
            const result = await updateClassById(classId, data);
            if (result.success) {
                setClasses(prevClasses =>
                    prevClasses.map(item =>
                        item.id === classId ? { ...item, status: true } : item
                    )
                );
            }
        } catch (error) {
            console.error("Error approving student:", error);
        }
    };

    const studentsToApprove = classes.filter(classItem => !classItem.status);

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
                        {classes.map((classItem) => {
                            const student = classItem.student;
                            return (
                                <Card key={classItem.id} className="shadow-md hover:shadow-lg transition-all">
                                    <div className="flex flex-col p-4">
                                        <span className="text-lg font-semibold">
                                            {student ? `${student.nombre} ${student.apellido}` : "Estudiante desconocido"}
                                        </span>
                                        <span className="text-gray-600">
                                            Estado: {classItem.status ? "Aprobado" : "Pendiente"}
                                        </span>
                                                                  <Link to={`/clase/${classItem.id}`} className="text-purple-500 hover:underline mt-2">
                                            Ver detalles
                                        </Link>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Sección de estudiantes por aprobar */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">Estudiantes por Aprobar</h2>
                    {studentsToApprove.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={studentsToApprove}
                            renderItem={(classItem) => (
                                <List.Item
                                    key={classItem.id}
                                    actions={[
                                        <Button className="bg-purple-600  text-white" onClick={() => approveStudent(classItem.id)}>
                                            Aprobar
                                        </Button>,
                                        <Link to={`/student/${classItem.student?.id}`} className="text-purple-500 hover:underline">
                                            Ver detalles
                                        </Link>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={classItem.student ? `${classItem.student.nombre} ${classItem.student.apellido}` : "Estudiante desconocido"}
                                        description={`Estado: ${classItem.status ? "Aprobado" : "Pendiente"}`}
                                    />
                                    <Tag color={classItem.status ? "green" : "red"}>
                                        {classItem.status ? "Aprobado" : "Pendiente"}
                                    </Tag>
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
                        {["Juan Pérez", "Ana Gómez", "Carlos López"].map((studentName, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <MessageOutlined className="text-purple-600 w-6 h-6" />
                                <span className="text-lg font-semibold">{studentName}</span>
                                <p className="text-gray-500">
                                    {index === 0
                                        ? "¿Puedo preguntar sobre el examen?"
                                        : index === 1
                                        ? "¿Cuándo es la próxima clase?"
                                        : "Necesito ayuda con los ejercicios de matemáticas."}
                                </p>
                            </div>
                        ))}
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
