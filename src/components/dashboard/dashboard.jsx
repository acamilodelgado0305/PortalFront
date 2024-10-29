import { useState } from 'react';
import { MessageCircle, HeadphonesIcon, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import StudentsSection from './StudentsSection';
import TeachersSection from './TeacherSection';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('students');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className="flex min-h-screen">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex flex-col w-full">
                {/* Header fijo */}
                <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-700">
                                <MessageCircle size={20} />
                                <span>Chat</span>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-700">
                                <HeadphonesIcon size={20} />
                                <span>Soporte</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer text-red-600 hover:text-red-700"
                            onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Salir</span>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 p-8">
                    {activeSection === 'students' && <StudentsSection />}
                    {activeSection === 'teachers' && <TeachersSection />}
                    {/* Agregar más secciones según sea necesario */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;