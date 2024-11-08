import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEye, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import Filters from '../results/components/Filters';

const TeachersSection = ({ onViewTeacher }) => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(true);
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeFilters, setActiveFilters] = useState({
        priceRange: '',
        country: '',
        availability: '',
        specialty: '',
        language: '',
        isNative: false,
        category: ''
    });


    const [showFilterModal, setShowFilterModal] = useState({
        price: false,
        country: false,
        availability: false,
        specialty: false,
        language: false,
        category: false
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers');
                const data = await response.json();
                setTeachers(data.data);
                setFilteredTeachers(data.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los profesores');
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = teachers.filter(teacher => teacher.status === !showInactive);

            if (searchTerm) {
                filtered = filtered.filter(teacher =>
                    teacher.lastName && teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (activeFilters.priceRange) {
                const [min, max] = activeFilters.priceRange.replace(/[^0-9.-]+/g, '').split('-').map(Number);
                filtered = filtered.filter(teacher =>
                    teacher.hourlyRate >= min && (max ? teacher.hourlyRate <= max : true)
                );
            }

            if (activeFilters.country) {
                filtered = filtered.filter(teacher =>
                    teacher.countryOfBirth?.toLowerCase() === activeFilters.country.toLowerCase()
                );
            }

            if (activeFilters.isNative) {
                filtered = filtered.filter(teacher => teacher.languageLevel === 'native');
            }

            if (activeFilters.specialty) {
                filtered = filtered.filter(teacher =>
                    teacher.subjectYouTeach?.toLowerCase().includes(activeFilters.specialty.toLowerCase())
                );
            }

            if (activeFilters.language) {
                filtered = filtered.filter(teacher =>
                    teacher.language && teacher.language.toLowerCase().includes(activeFilters.language.toLowerCase())
                );
            }

            setFilteredTeachers(filtered);
        };
        applyFilters();
    }, [teachers, showInactive, searchTerm, activeFilters]);

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

            <Filters
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                clearFilters={() => setActiveFilters({
                    priceRange: '',
                    country: '',
                    availability: '',
                    specialty: '',
                    language: '',
                    isNative: false,
                    category: ''
                })}
                filterOptions={{
                    priceRange: ['$10 - $25', '$25 - $50', '$50 - $75', '$75 - $100+'],
                    country: [
                        { code: 'us', name: 'Estados Unidos' },
                        { code: 'es', name: 'España' },
                        { code: 'mx', name: 'México' },
                        { code: 'ar', name: 'Argentina' },
                        { code: 'co', name: 'Colombia' },
                        { code: 'cl', name: 'Chile' },
                        { code: 'pe', name: 'Perú' },
                        { code: 've', name: 'Venezuela' },
                        { code: 'gb', name: 'Reino Unido' },
                        { code: 'ca', name: 'Canadá' }
                    ],
                    availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    specialty: ['Matemáticas', 'Inglés', 'Ciencias', 'Historia', 'Literatura', 'Física', 'Química'],
                    language: ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Italiano'] // Asegurarse de que este campo esté definido y no vacío
                }}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {loading && <p>Cargando profesores...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {filteredTeachers.map(teacher => (
                    <div className="bg-white p-6 shadow-sm rounded-lg hover:shadow-md transition-shadow" key={teacher.id}>
                        <div className="flex items-center mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
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
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={() => onViewTeacher(teacher.id)}
                                >
                                    <FaUserCircle className="text-blue-500" size={20} />
                                </button>

                                {showInactive && (
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        onClick={() => approveTeacher(teacher)}
                                    >
                                        <FaCheckCircle className="text-green-500" size={20} />
                                    </button>
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
            >
                {selectedTeacher && (
                    <div>
                        <p><strong>Nombre:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                        <p><strong>Email:</strong> {selectedTeacher.email}</p>
                        <p><strong>Tarifa por hora:</strong> ${selectedTeacher.hourlyRate}</p>
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
