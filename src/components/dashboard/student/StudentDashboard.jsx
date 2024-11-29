import { useEffect, useState } from 'react';
import { Button } from 'antd';  // Usamos el Button de Ant Design
import { Card } from '@mui/material';  // Usamos el Card de Material UI
import { Link } from 'react-router-dom';  // Para los enlaces
import { FormRegister } from './components/formRegister';
import { useAuth } from '../../../Context/AuthContext';
import { getStudentById } from '../../../services/studendent.services';
import { data } from 'autoprefixer';
import { Modal, Input, Upload, message } from 'antd';  // Usamos Ant Design para el modal
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
    const [isRegister, setIsRegister] = useState(true);
    const [showModalRegister, setShowModalRegister] = useState(false);
    const [studentRegis, setStudentRegis] = useState("");
    
    const [userName, setUserName] = useState('');  // Estado para el nombre del usuario
    const { user, accessToken } = useAuth();  // Obtener los datos del usuario desde el contexto

    // funcion para optener el usuario con toda la informacion
    const getStudent = async () => {
        try {
            const student = await getStudentById(user.id);
            if (student.success) {
                setIsRegister(student.success)
                setStudentRegis(student.data)
            }else {
                setIsRegister(student.success)
            }
        } catch (error) {
            console.log(error)
            if (error.response.data) {
                setIsRegister(error.response.data.success);
                return;
            }
        }
    }
    useEffect(() => {
    getStudent();
    },[])
    console.log(studentRegis)
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
                   {
                     !isRegister 
                     && 
                     <Button
                     onClick={() => setShowModalRegister(true)}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 transition-all ml-9">
                       Continuar con el registro
                     </Button>
                    }
                        
                    </div>
                </div>

                {/* Card de Datos del Estudiante */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Tu Perfil</h2>
                    <Card className="flex flex-col items-center">
                        {/* Imagen de perfil, mostrando la URL de la imagen si está disponible */}
                        <div className="mb-4">
                            {studentRegis.url ? (
                                <img src={studentRegis.url} alt="Perfil" className="w-32 h-32 rounded-full" />
                            ) : studentData.profilePicture ? (
                                <img src={studentData.profilePicture} alt="Perfil" className="w-32 h-32 rounded-full" />
                            ) : (
                                <UserOutlined className="w-32 h-32 text-gray-500" />
                            )}
                        </div>

                        {/* Mostrar el nombre y correo */}
                        <div className="text-center">
                            <p className="font-semibold text-lg">{userName || studentRegis.nombre}</p>
                            <p className="text-gray-600">{user?.email || studentRegis.email}</p>
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
                    {
                        showModalRegister?
                        <FormRegister getStudent={getStudent} setIsRegister={setIsRegister} user={user} setShowModal={setShowModalRegister} showModal={showModalRegister} />
                        :null
                    }
        </div>
    );
};

export default StudentDashboard;
