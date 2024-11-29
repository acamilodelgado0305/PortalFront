import { useEffect, useState } from 'react';
import { Button } from 'antd';  // Usamos el Button de Ant Design
import { Card } from '@mui/material';  // Usamos el Card de Material UI
import { Link } from 'react-router-dom';  // Para los enlaces
import { FormRegister } from './components/formRegister';
import { useAuth } from '../../../Context/AuthContext';
import { getStudentById } from '../../../services/studendent.services';
import { data } from 'autoprefixer';


const professors = [
    { id: 1, name: 'Dr. Juan Pérez', subject: 'Matemáticas' },
    { id: 2, name: 'Prof. María Gómez', subject: 'Historia' },
    { id: 3, name: 'Lic. Laura Martínez', subject: 'Lengua y Literatura' },
];

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('students');
    const [isRegister, setIsRegister] = useState(true);
    const [showModalRegister, setShowModalRegister] = useState(false);
    const [studentRegis, setStudentRegis] = useState("");
    
    const {user} = useAuth();

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
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Encabezado */}
            <div className="w-full relative sticky top-0 bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
                <img className='rounded-full w-10 absolute top-0 left-[-20px]' src={studentRegis.url} alt="" />
                <h1 className="text-3xl font-semibold text-center">{`Bienvenido ${studentRegis?studentRegis.nombre: ""} a su Perfil Estudiantil`}</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-8 space-y-6">
                {/* Botón para ir a la pizarra */}
                <div className="flex justify-center">
                    <Link to="/pizarra">  {/* Ajusta la URL de acuerdo a tu estructura de rutas */}
                        <Button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
                            Ir a la Pizarra
                        </Button>
                    </Link>
                    {
                     !isRegister 
                     && 
                     <Button
                     onClick={() => setShowModalRegister(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all ml-9">
                       Continuar con el registro
                     </Button>
                    }
                </div>

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

                {/* Sección de actividades (opcional) */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Próximas Actividades</h2>
                    <p className="text-gray-600">Aquí aparecerán tus actividades y recordatorios.</p>
                    {/* Agregar calendario o tareas según sea necesario */}
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
