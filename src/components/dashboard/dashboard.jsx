import { useState } from 'react';
import { MessageCircle, HeadphonesIcon, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Index from "./index";
import StudentsSection from './StudentsSection';
import TeachersSection from './TeacherSection';
import TeacherDetail from './TeacherDetail';
import Calendar from "./Calendar";
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../results/Header';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('teachers');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleViewTeacher = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setActiveSection('teacherDetail');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                <div>
                    <Header
                    />
                </div >
                {/* <div className="flex items-center justify-between px-8 py-4">
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
 */}

                <div className="flex-1 p-8">
                    {activeSection === 'dashboard' && <Index />}
                    {activeSection === 'students' && <StudentsSection />}
                    {activeSection === 'teachers' && (
                        <TeachersSection onViewTeacher={handleViewTeacher} />
                    )}
                    {activeSection === 'teacherDetail' && selectedTeacherId && (
                        <TeacherDetail
                            teacherId={selectedTeacherId}
                            onBack={() => setActiveSection('teachers')}
                        />
                    )}
                    {activeSection === 'calendar' && <Calendar />}
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
