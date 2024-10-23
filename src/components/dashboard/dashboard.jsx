import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "antd";


// Datos simulados para estudiantes y facturación
const sampleStudents = [
    { id: 1, name: "Juan Pérez", course: "Matemáticas", teacher: "Carlos Mendoza" },
    { id: 2, name: "Ana Gómez", course: "Ciencias", teacher: "Laura Ramírez" },
];

const sampleBilling = [
    { id: 1, date: "2024-10-01", amount: 500, status: "Paid" },
    { id: 2, date: "2024-09-15", amount: 300, status: "Pending" },
];

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("teachers"); // Controla la sección activa
    const [teachers, setTeachers] = useState([]); // Controla los profesores
    const [selectedTeacher, setSelectedTeacher] = useState(null); // Controla el profesor seleccionado
    const [isModalVisible, setIsModalVisible] = useState(false); // Controla el estado del modal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Llamada a la API para obtener los profesores
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers');
                const data = await response.json();
                setTeachers(data.data);
                setLoading(false);
                console.log("teacher datos", data.data);
            } catch (err) {
                setError('Error al cargar los profesores');
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Mostrar disponibilidad de cada día habilitado
    const getAvailability = (availability) => {
        return Object.keys(availability).map((day) => {
            if (availability[day].enabled) {
                return (
                    <div key={day}>
                        <strong>{day}:</strong>{" "}
                        {availability[day].timeSlots
                            .map((slot) =>
                                slot.start ? `${slot.start} - ${slot.end}` : "No horario disponible"
                            )
                            .join(", ")}
                    </div>
                );
            }
            return null;
        });
    };

    // Función para abrir el modal
    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    // Función para cerrar el modal
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Sección de profesores
    const TeachersSection = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Profesores</h2>
            {Array.isArray(teachers) && teachers.length === 0 ? (
                <p>Cargando profesores...</p>
            ) : (
                <ul className="divide-y divide-gray-300 bg-white shadow rounded-md">
                    {Array.isArray(teachers) && teachers.map((teacher) => (
                        <li
                            key={teacher.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer"
                            onClick={() => showModal(teacher)}
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">{teacher.firstName} {teacher.lastName}</h4>
                                    <p className="text-gray-600 text-sm">{teacher.email}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-bold text-green-600">${teacher.hourlyRate}/hora</p>
                                <p className="text-sm text-gray-500">Comisión: {teacher.commissionAmount} ({teacher.commissionRate * 100}%)</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal de Ant Design para mostrar los detalles del profesor */}
            <Modal
                title="Detalles del Profesor"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                {selectedTeacher && (
                    <div>
                        <p><strong>ID:</strong> {selectedTeacher.id}</p>
                        <p><strong>Tarifa por Hora:</strong> ${selectedTeacher.hourlyRate}</p>
                        <p><strong>Comisión:</strong> ${selectedTeacher.commissionAmount} ({selectedTeacher.commissionRate * 100}%)</p>
                        <p><strong>Disponibilidad:</strong></p>
                        <div>{getAvailability(selectedTeacher.Availability)}</div>
                        <p><strong>Última Actualización:</strong> {new Date(selectedTeacher.updatedAt).toLocaleDateString()}</p>
                        <p><strong>Estado:</strong> {selectedTeacher.status ? "Activo" : "Inactivo"}</p>
                    </div>
                )}
            </Modal>
        </div>
    );

    // Otras secciones (Estudiantes, Estadísticas, Facturación) aquí...

    return (
        <div className="flex min-h-screen">
            {/* Barra lateral */}
            <div className="w-1/6 bg-gray-800 text-white p-4">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                <ul>
                    <li
                        className={`cursor-pointer p-2 mb-2 ${activeSection === "teachers" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                        onClick={() => setActiveSection("teachers")}
                    >
                        Profesores
                    </li>
                    <li
                        className={`cursor-pointer p-2 mb-2 ${activeSection === "students" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                        onClick={() => setActiveSection("students")}
                    >
                        Estudiantes
                    </li>
                    <li
                        className={`cursor-pointer p-2 mb-2 ${activeSection === "stats" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                        onClick={() => setActiveSection("stats")}
                    >
                        Estadísticas
                    </li>
                    <li
                        className={`cursor-pointer p-2 mb-2 ${activeSection === "billing" ? "bg-gray-600" : "bg-gray-700"} rounded`}
                        onClick={() => setActiveSection("billing")}
                    >
                        Facturación
                    </li>
                </ul>
            </div>

            {/* Secciones dinámicas */}
            <div className="w-3/4 p-8">
                {activeSection === "teachers" && <TeachersSection />}
                {/* Otras secciones dinámicas... */}
            </div>
        </div>
    );
};

export default Dashboard;
