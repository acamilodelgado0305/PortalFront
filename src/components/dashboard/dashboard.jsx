import { useState, useEffect } from 'react';
import { MessageCircle, HeadphonesIcon, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Index from "./index";
import StudentsSection from './StudentsSection';
import TeachersSection from './TeacherSection';
import TeacherDetail from './TeacherDetail';
import TeacherDashboard from './teacher/TeacherDashboard';  // Dashboard de Profesor
import StudentDashboard from './student/StudentDashboard';  // Dashboard de Estudiante
import Calendar from "./Calendar";
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../results/Header';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const { user } = useAuth(); // Trae los datos del usuario
    const navigate = useNavigate();

    useEffect(() => {
        // Establece la sección activa según el rol del usuario cuando se monta el componente
        if (user.role === 'admin') {
            setActiveSection('dashboard');  // Para admin, la vista inicial es el dashboard principal
        } else if (user.role === 'teacher') {
            setActiveSection('teachers');  // Para profesor, se carga la sección de profesores
        } else if (user.role === 'student') {
            setActiveSection('students');  // Para estudiante, se carga la sección de estudiantes
        }
    }, [user.role]);  // Re-ejecuta cada vez que cambia el rol del usuario

    const handleViewTeacher = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setActiveSection('teacherDetail');
    };

    // Si el rol es 'admin', muestra todo normal
    if (user.role === 'admin') {
        return (
            <div className="flex min-h-screen">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className="w-full flex flex-col items-center p-8"> {/* Aquí centramos el contenido */}
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 w-full">
                        {activeSection === 'dashboard' && <Index />}
                        {activeSection === 'students' && <StudentsSection />}
                        {activeSection === 'teachers' && <TeachersSection onViewTeacher={handleViewTeacher} />}
                        {activeSection === 'teacherDetail' && selectedTeacherId && (
                            <TeacherDetail teacherId={selectedTeacherId} onBack={() => setActiveSection('teachers')} />
                        )}
                        {activeSection === 'calendar' && <Calendar />}
                    </div>
                </div>
            </div>
        );
    }

    // Si el rol es 'teacher', muestra solo el Dashboard del Profesor
    if (user.role === 'teacher') {
        return (
            <div className="flex min-h-screen">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className="w-full flex flex-col items-center p-8"> {/* Aquí centramos el contenido */}
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 w-full">
                        {activeSection === 'teachers' && <TeacherDashboard />} {/* Solo muestra TeacherDashboard */}
                        {activeSection === 'calendar' && <Calendar />}
                    </div>
                </div>
            </div>
        );
    }

    // Si el rol es 'student', muestra solo el Dashboard del Estudiante
    if (user.role === 'student') {
        return (
            <div className="flex min-h-screen">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className="w-full flex flex-col items-center p-8"> {/* Aquí centramos el contenido */}
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 min-w-full">
                        {activeSection === 'students' && <StudentDashboard />} {/* Solo muestra StudentDashboard */}
                        {activeSection === 'calendar' && <Calendar />}
                    </div>
                </div>
            </div>
        );
    }

    // En caso de que el rol no esté definido o sea inválido
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="w-full flex flex-col items-center p-8"> {/* Aquí centramos el contenido */}
                <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                    <Header />
                </div>
                <div className="flex-1">
                    <h1>Acceso denegado o rol no asignado</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
