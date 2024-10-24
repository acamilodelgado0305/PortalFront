import { useState } from 'react';
import Sidebar from './Sidebar';
import StudentsSection from './StudentsSection'; // Tu componente de estudiantes
import TeachersSection from './TeacherSection'; // Componente de profesores

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('students'); // Controla la sección activa

    return (
        <div className="flex min-h-screen">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="w-5/6 p-8">
                {activeSection === 'students' && <StudentsSection />}
                {activeSection === 'teachers' && <TeachersSection />}
                {/* Agregar más secciones según sea necesario */}
            </div>
        </div>
    );
};

export default Dashboard;