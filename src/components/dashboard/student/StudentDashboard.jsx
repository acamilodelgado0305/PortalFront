import { useState } from 'react';



const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('students');

    return (
        <div className="flex min-h-screen">
            <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                <h1>Dashboard Estudiante</h1>
            </div>

        </div>
    );
};

export default StudentDashboard;
