import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEye, FaUserCircle } from 'react-icons/fa';

const TeachersSection = () => {
    const [teachers, setTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(true);
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers');
                console.log(JSON.stringify(response))
                const data = await response.json();
                setTeachers(data.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los profesores');
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => setIsModalVisible(false);

    const approveTeacher = (teacher) => {
        console.log(`Profesor ${teacher.firstName} ${teacher.lastName} aprobado`);
        setApprovalModalVisible(true);
    };

    const filteredTeachers = teachers.filter(teacher => teacher.status === !showInactive);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">
                {showInactive ? 'Profesores Inactivos' : 'Profesores Activos'}
            </h1>

            <Button
                type="default"
                className="mb-4"
                onClick={() => setShowInactive(!showInactive)}
            >
                {showInactive ? 'Mostrar Profesores Activos' : 'Mostrar Profesores Inactivos'}
            </Button>

            {loading && <p>Cargando profesores...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTeachers.map(teacher => (
                    <div className="bg-white p-6 shadow-sm rounded-lg hover:shadow-md transition-shadow" key={teacher.id}>
                        <div className="flex items-center mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                {teacher.profileImageUrl ? (
                                    <img
                                        src={teacher.profileImageUrl}
                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.currentTarget.src = '/api/placeholder/64/64';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <h4 className="text-lg font-bold text-gray-800 line-clamp-1">
                                    {teacher.firstName} {teacher.lastName}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{teacher.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm font-medium text-gray-700">
                                ${teacher.hourlyRate}/hora
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={() => showModal(teacher)}
                                >
                                    <FaEye className="text-purple-500" size={20} />
                                </button>
                                {showInactive && (
                                    <Button
                                        type="default"
                                        className="bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
                                        onClick={() => approveTeacher(teacher)}
                                    >
                                        Aprobar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                    <div className="space-y-3">
                        <div className="flex items-center mb-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mr-4">
                                {selectedTeacher.profileImageUrl ? (
                                    <img
                                        src={selectedTeacher.profileImageUrl}
                                        alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.currentTarget.src = '/api/placeholder/80/80';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaUserCircle className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3>
                                <p className="text-gray-500">{selectedTeacher.email}</p>
                            </div>
                        </div>
                        <p className="text-gray-700"><strong>Tarifa por Hora:</strong> ${selectedTeacher.hourlyRate}</p>
                        <p className="text-gray-700"><strong>Comisión:</strong> ${selectedTeacher.commissionAmount} ({selectedTeacher.commissionRate * 100}%)</p>
                        <p className="text-gray-700"><strong>Última Actualización:</strong> {new Date(selectedTeacher.updatedAt).toLocaleDateString()}</p>
                        <p className="text-gray-700"><strong>Estado:</strong> {selectedTeacher.status ? "Activo" : "Inactivo"}</p>
                    </div>
                )}
            </Modal>

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