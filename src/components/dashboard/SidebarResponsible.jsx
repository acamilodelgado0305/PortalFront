import React, { useState, useEffect } from 'react';
import {
    FaChalkboardTeacher,
    FaChartBar,
    FaCalendarAlt,
    FaUserFriends,
    FaWallet,
    FaLink,
    FaLifeRing,
    FaGift,
    FaChevronLeft,
    FaChevronRight,
    FaGraduationCap
} from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';  // Asegúrate de importar el contexto

const SidebarResponsible = ({ activeSection, setActiveSection }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth(); // Trae el rol del usuario desde el contexto
    const [isMobile, setIsMobile] = useState(false);

    // Los items comunes del menú
    const commonMenuItems = [
        { icon: FaUserFriends, text: "My Students", id: "students" },
        { icon: FaCalendarAlt, text: "Calendar", id: "calendar" },
        { icon: FaGift, text: "Payments", id: "rewards" },
    ];

    // Los items específicos para 'teacher'
    const teacherMenuItems = [
        { icon: FaChalkboardTeacher, text: "Teachers", id: "teachers" },
        { icon: FaLifeRing, text: "Support", id: "support" }
    ];

    // Los items específicos para 'admin'
    const adminMenuItems = [
        { icon: FaChartBar, text: "Dashboard", id: "dashboard" },
        { icon: FaChalkboardTeacher, text: "Teachers", id: "teachers" },
        { icon: FaLink, text: "Workspaces", id: "workspaces" },
        { icon: FaWallet, text: "Earnings", id: "earnings" },
        { icon: FaGift, text: "Earn $154.244 and more", id: "rewards" },
        { icon: FaUserFriends, text: "Studen-landing", id: "landing" },
    ];

    // Los items del menú según el rol
    let menuItems = commonMenuItems;

    if (user.role === 'teacher') {
        menuItems = [...menuItems, ...teacherMenuItems]; // Agrega los items específicos para el profesor
    }

    if (user.role === 'admin') {
        menuItems = [...adminMenuItems, ...menuItems]; // El admin ve todos los items
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial window size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={`transition-all duration-300 ease-in-out bg-white border-b border-gray-200  relative shadow-sm w-[100%]`}
        >

            {/* Header */}
            <div className={`h-16 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <FaGraduationCap className="h-8 w-8 text-purple-600" />
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3">
                            <h1 className="text-xl font-bold text-gray-800">Esturio</h1>
                            <p className="text-xs text-gray-500">Learning Platform</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 flex flex-row overflow-x-auto max-w-max m-auto space-x-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`cursor-pointer p-2 rounded flex items-center
                            ${activeSection === item.id ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}
                            ${isCollapsed ? 'justify-center' : 'justify-start'}
                            transition-colors duration-200`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <Icon
                                className={`${activeSection === item.id ? 'text-gray-800' : 'text-gray-600'} 
                                ${!isCollapsed && 'mr-3'}`}
                                size={20}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SidebarResponsible;
