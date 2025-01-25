import { useState } from 'react';
import Index from '../index'; // Componente general para el Admin
import StudentsSection from '../StudentsSection'; // Sección para gestionar estudiantes
import TeachersSection from '../TeacherSection'; // Sección para gestionar profesores
import Calendar from '../Calendar'; // Sección común de calendario
import Sidebar from '../Sidebar'; // Sidebar del Admin
import Header from '../../results/Header';
import Landing from "./UsersLandingList"; // Cabecera común

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    return (
        <div className="flex min-h-screen">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                <Header />
            </div>
            <div className="flex-1 p-8">
                {activeSection === 'dashboard' && <Index />}
                {activeSection === 'students' && <StudentsSection />}
                {activeSection === 'teachers' && <TeachersSection />}
                {activeSection === 'calendar' && <Calendar />}
                {activeSection === 'landing' && <Landing />}
            </div>
        </div>
    );
};

export default AdminDashboard;
