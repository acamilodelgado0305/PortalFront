import { useState } from 'react';
import { Button, Modal, Input, Upload, message } from 'antd';  // Usamos Ant Design para el modal
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '@mui/material';  // Usamos el Card de Material UI
import { Link } from 'react-router-dom';  // Para los enlaces
import { UserOutlined, CameraOutlined } from '@ant-design/icons';  // Íconos de Ant Design

const professors = [
    { id: 1, name: 'Dr. Juan Pérez', subject: 'Matemáticas' },
    { id: 2, name: 'Prof. María Gómez', subject: 'Historia' },
    { id: 3, name: 'Lic. Laura Martínez', subject: 'Lengua y Literatura' },
];

// Datos simulados de estudiantes para la vista previa
const studentData = {
    userName: 'Juan Estudiante',
    email: 'juan@correo.com',
    profilePicture: "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg",  // URL de la foto
};

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('students');
    const [isModalVisible, setIsModalVisible] = useState(false);  // Estado para manejar la visibilidad del modal
    const [userName, setUserName] = useState('');  // Estado para el nombre del usuario
    const [profilePicture, setProfilePicture] = useState(null);  // Estado para la foto de perfil
    const { user, accessToken } = useAuth();  // Obtener los datos del usuario desde el contexto

    // Función para manejar el formulario de registro
    const handleRegister = () => {
        const data = {
            userName,
            email: user?.email,  // Email ya precargado desde el contexto
            profilePicture,
        };

        // Simulación de envío de datos (esto debe enviarse a tu API o servidor)
        console.log(data);
        message.success('Registro completado exitosamente');
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
        <div className="flex min-h-screen flex-col bg-gray-50 max-w-full mx-auto">
            {/* Encabezado */}
            <div className="w-full sticky top-0 bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
                <h1 className="text-3xl font-semibold text-center">Bienvenido a tu Perfil Estudiantil</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-8 space-y-6">
                <div className="flex-1 p-8 space-y-6">
                    {/* Contenedor con los dos botones uno al lado del otro */}
                    <div className="flex justify-center space-x-4"> {/* Alinea horizontalmente y agrega espacio entre botones */}
                        {/* Botón para ir a la pizarra */}
                        <Link to="/whiteboard/:room">
                            <Button className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
                                Ir a la Pizarra
                            </Button>
                        </Link>

                        {/* Botón "Continuar Registro" */}
                        <Button
                            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all"
                            onClick={() => setIsModalVisible(true)}  // Mostrar el modal
                        >
                            Continuar Registro
                        </Button>
                    </div>
                </div>

                {/* Modal para continuar con el registro */}
                <Modal
                    title="Continuar Registro"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}  // Cerrar el modal
                    onOk={handleRegister}  // Enviar datos
                    className="rounded-xl shadow-xl"
                    bodyStyle={{ padding: '20px' }} // Añadir padding adicional dentro del modal
                >
                    <div>
                        {/* Campo para el correo, precargado desde el contexto */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                            <Input
                                id="email"
                                value={user?.email}
                                disabled
                                className="w-full mt-2 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Campo para el nombre */}
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                            <Input
                                id="name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Escribe tu nombre"
                                className="w-full mt-2 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Campo para cargar foto de perfil */}
                        <div className="mb-6">
                            <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-700 mb-2">Foto de Perfil</label>
                            <Upload
                                id="profilePicture"
                                showUploadList={false}
                                beforeUpload={() => false}  // Prevenir subida automática
                                onChange={handleUploadChange}
                                accept="image/*"
                                className="mb-2"
                            >
                                <Button
                                    icon={<CameraOutlined />}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none transition-all"
                                >
                                    Subir Foto
                                </Button>
                            </Upload>
                        </div>
                    </div>
                </Modal>


                {/* Card de Datos del Estudiante */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Tu Perfil</h2>
                    <Card className="flex flex-col items-center">
                        {/* Imagen de perfil, mostrando la URL de la imagen si está disponible */}
                        <div className="mb-4">
                            {profilePicture ? (
                                <img src={URL.createObjectURL(profilePicture)} alt="Perfil" className="w-32 h-32 rounded-full" />
                            ) : studentData.profilePicture ? (
                                <img src={studentData.profilePicture} alt="Perfil" className="w-32 h-32 rounded-full" />
                            ) : (
                                <UserOutlined className="w-32 h-32 text-gray-500" />
                            )}
                        </div>

                        {/* Mostrar el nombre y correo */}
                        <div className="text-center">
                            <p className="font-semibold text-lg">{userName || studentData.userName}</p>
                            <p className="text-gray-600">{user?.email || studentData.email}</p>
                        </div>
                    </Card>
                </div>

                {/* Sección de profesores */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Tus Clases</h2>
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
