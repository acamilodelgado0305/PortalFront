import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEye, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import Filters from '../results/components/Filters';
import Flag from 'react-world-flags';

const TeachersSection = ({ onViewTeacher }) => {
    const [teachers, setTeachers] = useState([]); // Todos los profesores
    const [filteredActiveTeachers, setFilteredActiveTeachers] = useState([]); // Profesores activos filtrados
    const [filteredInactiveTeachers, setFilteredInactiveTeachers] = useState([]); // Profesores inactivos filtrados
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);



    const [activeFilters, setActiveFilters] = useState({
        priceRange: [10, 35],
        fullName: '',
        country: '',
        availability: [],
        specialty: '',
        language: '',
        isNative: false,
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers');
                const data = await response.json();
                setTeachers(data.data); // Todos los profesores
                setFilteredActiveTeachers(data.data.filter((teacher) => teacher.status === true));
                setFilteredInactiveTeachers(data.data.filter((teacher) => teacher.status === false));
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los profesores');
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [activeFilters]);

    const applyFilters = () => {
        const activeTeachers = teachers.filter((teacher) => teacher.status === true);
        const inactiveTeachers = teachers.filter((teacher) => teacher.status === false);

        // Aplicar filtros a los activos
        let filteredActive = [...activeTeachers];
        if (activeFilters.fullName) {
            filteredActive = filteredActive.filter((teacher) =>
                `${teacher.firstName} ${teacher.lastName}`
                    .toLowerCase()
                    .includes(activeFilters.fullName.toLowerCase())
            );
        }
        if (activeFilters.priceRange) {
            const [min, max] = activeFilters.priceRange;
            filteredActive = filteredActive.filter((teacher) => {
                const rate = Number(teacher.hourlyRate);
                return rate >= min && rate <= max;
            });
        }

        // Aplicar filtros a los inactivos
        let filteredInactive = [...inactiveTeachers];
        if (activeFilters.fullName) {
            filteredInactive = filteredInactive.filter((teacher) =>
                `${teacher.firstName} ${teacher.lastName}`
                    .toLowerCase()
                    .includes(activeFilters.fullName.toLowerCase())
            );
        }

        setFilteredActiveTeachers(filteredActive);
        setFilteredInactiveTeachers(filteredInactive);
    };

    const clearFilters = () => {
        setActiveFilters({
            priceRange: [10, 35],
            fullName: '',
            country: '',
            availability: [],
            specialty: '',
            language: '',
            isNative: false,
        });
    };

    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => setIsModalVisible(false);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    const approveTeacher = (teacher) => {
        console.log(`Profesor ${teacher.firstName} ${teacher.lastName} aprobado`);
        setApprovalModalVisible(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Profesores</h1>

            <Filters
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                clearFilters={clearFilters}
                filterOptions={{
                    country: [
                        { code: 'us', name: 'Estados Unidos' },
                        { code: 'es', name: 'España' },
                        { code: 'mx', name: 'México' },
                    ],
                    availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    specialty: ['Matemáticas', 'Inglés', 'Ciencias', 'Historia'],
                    language: ['Español', 'Inglés', 'Francés'],
                }}
                showFilterModal={{}}
                setShowFilterModal={() => { }}
            />

            <h2 className="text-2xl font-bold mb-4">Profesores Activos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredActiveTeachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                {teacher.profileImageUrl ? (
                                    <img
                                        src={teacher.profileImageUrl}
                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                    <Flag
                                        code={teacher.countryOfBirth?.toUpperCase()}
                                        className="mr-2 w-6 h-4"
                                    />
                                    {teacher.firstName} {teacher.lastName}
                                </h4>
                                <p className="text-sm text-gray-500">{teacher.email}</p>
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Profesores Inactivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredInactiveTeachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                {teacher.profileImageUrl ? (
                                    <img
                                        src={teacher.profileImageUrl}
                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                    <Flag
                                        code={teacher.countryOfBirth?.toUpperCase()}
                                        className="mr-2 w-6 h-4"
                                    />
                                    {teacher.firstName} {teacher.lastName}
                                </h4>
                                <p className="text-sm text-gray-500">{teacher.email}</p>
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
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={() => onViewTeacher(teacher.id)}
                                >
                                    <FaUserCircle className="text-blue-500" size={20} />
                                </button>
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={() => approveTeacher(teacher)}
                                >
                                    <FaCheckCircle className="text-green-500" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                title="Aprobar Profesor"
                visible={approvalModalVisible}
                onOk={() => setApprovalModalVisible(false)}
                onCancel={() => setApprovalModalVisible(false)}
                okText="Aceptar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas aprobar al profesor?</p>
            </Modal>

            <Modal
                title={`${selectedTeacher?.firstName} ${selectedTeacher?.lastName}`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                centered
            >
                {selectedTeacher && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                                {selectedTeacher.profileImageUrl ? (
                                    <img
                                        src={selectedTeacher.profileImageUrl}
                                        alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaUserCircle className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">
                                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                                </h4>
                                <p className="text-sm text-gray-500">{selectedTeacher.email}</p>
                                <p className="text-sm font-medium text-gray-700">
                                    ${selectedTeacher.hourlyRate}/hora
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-lg font-bold text-gray-700 mb-2">
                                    Información Personal
                                </h5>
                                <p className="text-gray-600">
                                    <span className="font-medium">País:</span>{' '}
                                    {selectedTeacher.countryOfBirth}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Idiomas:</span>{' '}
                                    {selectedTeacher.languages?.join(', ')}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Nivel de Idioma:</span>{' '}
                                    {selectedTeacher.languageLevel}
                                </p>
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-700 mb-2">
                                    Información Académica
                                </h5>
                                <p className="text-gray-600">
                                    <span className="font-medium">Especialidad:</span>{' '}
                                    {selectedTeacher.subjectYouTeach}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Experiencia:</span>{' '}
                                    {selectedTeacher.yearsOfExperience} años
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TeachersSection;
