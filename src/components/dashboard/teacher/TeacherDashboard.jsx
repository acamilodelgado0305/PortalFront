import { useState } from 'react';


const TeacherDashboard = () => {
    const [activeSection, setActiveSection] = useState('teachers');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);

    const handleViewTeacher = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setActiveSection('teacherDetail');
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                <h1>Dashboard Profesor</h1>
            </div>
            <div className="flex-1 p-8">
            </div>
        </div>
    );
};

export default TeacherDashboard;
