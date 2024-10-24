import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEye, FaUserCircle } from 'react-icons/fa';  // Importamos el ícono del ojo

const TeachersSection = () => {
    const [teachers, setTeachers] = useState([]); // Estado para almacenar los profesores
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(true); // Controla si se muestran inactivos o activos
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);

    // Llamada a la API para obtener los profesores
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers'); // Llamada a tu API real
                const data = await response.json();
                setTeachers(data.data); // Asignar los datos recibidos de la API
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los profesores');
                setLoading(false);
            }
        };

        fetchTeachers(); // Ejecutar la función para traer los profesores
    }, []);

    // Función para mostrar el modal de detalles
    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    // Función para cerrar el modal de detalles
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Función para aprobar a un profesor
    const approveTeacher = (teacher) => {
        console.log(`Profesor ${teacher.firstName} ${teacher.lastName} aprobado`); // Simula la aprobación
        setApprovalModalVisible(true); // Muestra el modal de aprobación
    };

    // Filtrar profesores por su estado (activos o inactivos)
    const filteredTeachers = teachers.filter(teacher => teacher.status === !showInactive);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">
                {showInactive ? 'Profesores Inactivos' : 'Profesores Activos'}
            </h1>

            {/* Botón para alternar entre los profesores activos e inactivos */}
            <Button
                type="default"
                style={{ marginBottom: '16px' }}
                onClick={() => setShowInactive(!showInactive)}
            >
                {showInactive ? 'Mostrar Profesores Activos' : 'Mostrar Profesores Inactivos'}
            </Button>

            {loading && <p>Cargando profesores...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-wrap">
                {filteredTeachers.map(teacher => (
                    <div className="bg-white p-4 shadow rounded-md flex flex-col justify-between w-72 m-4" key={teacher.id}>
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                                {teacher.profileImageUrl ? (
                                    <img
                                        src={teacher.profileImageUrl}
                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="w-full h-full text-gray-400" />
                                )}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-bold">{teacher.firstName} {teacher.lastName}</h4>
                                <p className="text-sm text-gray-500">{teacher.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Tarifa por hora: ${teacher.hourlyRate}</p>
                            {/* Reemplazamos el botón "Ver detalles" por el icono del ojo */}
                            <FaEye
                                className="text-purple-500 cursor-pointer"
                                size={24}
                                onClick={() => showModal(teacher)}
                            />
                            {/* Botón de aprobar con un color diferente */}
                            {showInactive && (
                                <Button
                                    type="default"
                                    style={{ backgroundColor: '#a855f7', borderColor: '#c631e7', color: 'white' }}  // Cambiamos el color del botón
                                    onClick={() => approveTeacher(teacher)}
                                >
                                    Aprobar
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para mostrar detalles del profesor */}
            <Modal
                title="Detalles del Profesor"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>Cancelar</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>OK</Button>,
                ]}
            >
                {selectedTeacher && (
                    <div>
                        <p><strong>Nombre:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                        <p><strong>Email:</strong> {selectedTeacher.email}</p>
                        <p><strong>Tarifa por Hora:</strong> ${selectedTeacher.hourlyRate}</p>
                        <p><strong>Comisión:</strong> ${selectedTeacher.commissionAmount} ({selectedTeacher.commissionRate * 100}%)</p>
                        <p><strong>Última Actualización:</strong> {new Date(selectedTeacher.updatedAt).toLocaleDateString()}</p>
                        <p><strong>Estado:</strong> {selectedTeacher.status ? "Activo" : "Inactivo"}</p>
                    </div>
                )}
            </Modal>

            {/* Modal de confirmación de aprobación */}
            <Modal
                title="Aprobación Exitosa"
                visible={approvalModalVisible}
                onOk={() => setApprovalModalVisible(false)}
                onCancel={() => setApprovalModalVisible(false)}
            >
                <p>El profesor ha sido activado exitosamente.</p>
            </Modal>
        </div>
    );
};

export default TeachersSection;
