import { useState, useEffect } from 'react';
import { MessageCircle, HeadphonesIcon, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import SidebarResponsible from './SidebarResponsible';
import Index from "./index";
import StudentsSection from './StudentsSection';
import TeachersSection from './TeacherSection';
import TeacherDetail from './TeacherDetail';
import TeacherDashboard from './teacher/TeacherDashboard';
import PaymenTeacher from './teacher/PaymenTeaher';
import StudentDashboard from './student/StudentDashboard';
import Payment from './student/Payment';
import Calendar from "./Calendar";
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../results/Header';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (user.role === 'admin') {
            setActiveSection('dashboard');
        } else if (user.role === 'teacher') {
            setActiveSection('teachers');
        } else if (user.role === 'student') {
            setActiveSection('students');
        }
    }, [user.role]);

    const handleViewTeacher = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setActiveSection('teacherDetail');
    };

    const renderSidebar = () => {
        if (isMobile) return null; // No renderiza el Sidebar en pantallas pequeñas
        return <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />;
    };

    if (user.role === 'admin') {
        return (
            <div className="flex min-h-screen">
                {renderSidebar()}
                <div className="w-full flex flex-col items-center md:p-8">
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 w-full">
                        {isMobile && <SidebarResponsible activeSection={activeSection} setActiveSection={setActiveSection} />}
                        {activeSection === 'dashboard' && <Index />}
                        {activeSection === 'students' && <StudentsSection />}
                        {activeSection === 'teachers' && <TeachersSection onViewTeacher={handleViewTeacher} />}
                        {activeSection === 'teacherDetail' && selectedTeacherId && (
                            <TeacherDetail teacherId={selectedTeacherId} onBack={() => setActiveSection('teachers')} />
                        )}
                        {activeSection === 'calendar' && <Calendar user={user} />}
                    </div>
                </div>
            </div>
        );
    }

    if (user.role === 'teacher') {
        return (
            <div className="flex min-h-screen">
                {renderSidebar()}
                <div className="w-full flex flex-col items-center md:p-8">
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 w-full">
                        {isMobile && <SidebarResponsible activeSection={activeSection} setActiveSection={setActiveSection} />}
                        {activeSection === 'teachers' && <TeacherDashboard />}
                        {activeSection === 'calendar' && <Calendar user={user} />}
                        {activeSection === 'rewards' && <PaymenTeacher user={user} />}
                    </div>
                </div>
            </div>
        );
    }

    if (user.role === 'student') {
        return (
            <div className="flex min-h-screen">
                {renderSidebar()}
                <div className="w-full flex flex-col items-center md:p-8">
                    <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                        <Header />
                    </div>
                    <div className="flex-1 min-w-full">
                        {isMobile && <SidebarResponsible activeSection={activeSection} setActiveSection={setActiveSection} />}
                        {activeSection === 'students' && <StudentDashboard />}
                        {activeSection === 'calendar' && <Calendar user={user} />}
                        {activeSection === 'rewards' && <Payment user={user} />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {renderSidebar()}
            <div className="w-full flex flex-col items-center md:p-8">
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
