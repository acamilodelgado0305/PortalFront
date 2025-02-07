import React, { useState } from 'react';
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

const Sidebar = ({ activeSection, setActiveSection }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth(); // Trae el rol del usuario desde el contexto

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

    return (
        <div
            className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out 
            bg-white border-r border-gray-200 min-h-screen relative shadow-sm`}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 p-1 rounded-full shadow-lg z-10 
                bg-white text-gray-600 hover:text-gray-800 border border-gray-200"
            >
                {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
            </button>

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

            <div className="p-4">
                {!isCollapsed && (
                    <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Menu</h2>
                )}

                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li
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
                                {!isCollapsed && (
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.text}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
