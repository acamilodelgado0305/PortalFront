import React from 'react';
import { FaChalkboardTeacher, FaCalendarAlt, FaUserFriends, FaWallet, FaLink, FaLifeRing, FaGift } from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection }) => {
    return (
        <div className="w-1/6 bg-gray-800 text-white p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <ul>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "teachers" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("teachers")}
                >
                    <FaChalkboardTeacher className="mr-2" /> Teachers
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "students" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("students")}
                >
                    <FaUserFriends className="mr-2" /> My Students
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "calendar" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("calendar")}
                >
                    <FaCalendarAlt className="mr-2" /> Calendar
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "workspaces" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("workspaces")}
                >
                    <FaLink className="mr-2" /> Workspaces
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "earnings" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("earnings")}
                >
                    <FaWallet className="mr-2" /> Earnings
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "support" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("support")}
                >
                    <FaLifeRing className="mr-2" /> Support
                </li>
                <li
                    className={`cursor-pointer p-2 mb-2 flex items-center ${activeSection === "rewards" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                    onClick={() => setActiveSection("rewards")}
                >
                    <FaGift className="mr-2" /> Earn $154.244 and more
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
