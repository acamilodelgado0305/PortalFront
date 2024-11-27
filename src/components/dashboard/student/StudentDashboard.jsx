import { useState } from 'react';
import { Button, Modal, Input, Upload, message } from 'antd';  // Usamos Ant Design para el modal
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '@mui/material';  // Usamos el Card de Material UI
import { Link } from 'react-router-dom';  // Para los enlaces

const professors = [
    { id: 1, name: 'Dr. Juan Pérez', subject: 'Matemáticas' },
    { id: 2, name: 'Prof. María Gómez', subject: 'Historia' },
    { id: 3, name: 'Lic. Laura Martínez', subject: 'Lengua y Literatura' },
];

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('students');
    const [isModalVisible, setIsModalVisible] = useState(false);  // Estado para manejar la visibilidad del modal
    const [userName, setUserName] = useState('');  // Estado para el nombre del usuario
    const [profilePicture, setProfilePicture] = useState(null);  // Estado para la foto de perfil
    const { user, accessToken } = useAuth();  // Obtener los datos del usuario desde el contexto

    // Función para manejar el formulario de registro
    const handleRegister = () => {
        // Aquí enviarías los datos a tu servidor
        const data = {
            userName,
            email: user?.email,  // Email ya precargado desde el contexto
            profilePicture,
        };

        // Simulación de envío de datos (esto debe enviarse a tu API o servidor)
        console.log(data);
        message.success('Registro completado exitosamente');

        // Cerrar el modal después de registrar
        setIsModalVisible(false);
    };

    // Función para manejar la carga de la foto de perfil
    const handleUploadChange = ({ file }) => {
        if (file.status === 'done') {
            message.success('Foto de perfil cargada');
            setProfilePicture(file.originFileObj);
        } else if (file.status === 'error') {
            message.error('Error al cargar la foto');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Encabezado */}
            <div className="w-full sticky top-0 bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
                <h1 className="text-3xl font-semibold text-center">Bienvenido su Perfil Estudiantil</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-8 space-y-6">
                {/* Botón para ir a la pizarra */}
                <div className="flex justify-center">
                    <Link to="/pizarra">
                        <Button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
                            Ir a la Pizarra
                        </Button>
                    </Link>
                </div>

                {/* Botón "Continuar Registro" */}
                <div className="flex justify-center mt-4">
                    <Button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                        onClick={() => setIsModalVisible(true)}  // Mostrar el modal
                    >
                        Continuar Registro
                    </Button>
                </div>

                {/* Modal para continuar con el registro */}
                <Modal
                    title="Continuar Registro"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}  // Cerrar el modal
                    onOk={handleRegister}  // Enviar datos
                >
                    <div>
                        {/* Campo para el correo, precargado desde el contexto */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Correo</label>
                            <Input
                                id="email"
                                value={user?.email}
                                disabled
                                className="w-full mt-2"
                            />
                        </div>

                        {/* Campo para el nombre */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-semibold">Nombre Completo</label>
                            <Input
                                id="name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Escribe tu nombre"
                                className="w-full mt-2"
                            />
                        </div>

                        {/* Campo para cargar foto de perfil */}
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-sm font-semibold">Foto de Perfil</label>
                            <Upload
                                id="profilePicture"
                                showUploadList={false}
                                beforeUpload={() => false}  // Prevenir subida automática
                                onChange={handleUploadChange}
                                accept="image/*"
                            >
                                <Button>Subir Foto</Button>
                            </Upload>
                        </div>
                    </div>
                </Modal>

                {/* Sección de profesores */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Tus Profesores</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {professors.map((professor) => (
                            <Card key={professor.id} className="shadow-md hover:shadow-lg transition-all">
                                <div className="flex flex-col p-4">
                                    <span className="text-lg font-semibold">{professor.name}</span>
                                    <span className="text-gray-600">{professor.subject}</span>
                                    <Link to={`/profesor/${professor.id}`} className="text-blue-500 hover:underline mt-2">
                                        Ver detalles
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sección de actividades */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Próximas Actividades</h2>
                    <p className="text-gray-600">Aquí aparecerán tus actividades y recordatorios.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
