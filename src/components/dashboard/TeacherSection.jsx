import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEye, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import Filters from '../results/components/Filters';
import Flag from 'react-world-flags';

const TeachersSection = ({ onViewTeacher }) => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(true);
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        priceRange: [10, 35],
        fullName: '',
        country: '',
        availability: '',
        specialty: '',
        language: '',
        isNative: false,
        category: ''
    });

    const [showFilterModal, setShowFilterModal] = useState({
        priceRange: false,
        country: false,
        availability: false,
        specialty: false,
        language: false,
        category: false
    });

    const filterOptions = {
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
        language: ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Italiano']
    };

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
        applyFilters();
    }, [teachers, showInactive, activeFilters]);

    const applyFilters = () => {
        let filtered = [...teachers];

        // Filtro por estado (activo/inactivo)
        filtered = filtered.filter(teacher => teacher.status === !showInactive);

        // Filtro por nombre completo
        if (activeFilters.fullName) {
            const searchTerm = activeFilters.fullName.toLowerCase();
            filtered = filtered.filter((teacher) => {
                const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
                return fullName.includes(searchTerm);
            });
        }

        // Filtro por rango de precio en USD
        if (activeFilters.priceRange && Array.isArray(activeFilters.priceRange)) {
            const [min, max] = activeFilters.priceRange;
            filtered = filtered.filter(teacher => {
                const rate = Number(teacher.hourlyRate);
                return !isNaN(rate) && rate >= min && rate <= max;
            });
        }

        // Filtro por país
        if (activeFilters.country) {
            const selectedCountry = filterOptions.country.find(c => c.name === activeFilters.country);
            if (selectedCountry) {
                filtered = filtered.filter(teacher =>
                    teacher.countryOfBirth?.toLowerCase() === selectedCountry.code.toLowerCase()
                );
            }
        }

        // Filtro por hablante nativo
        if (activeFilters.isNative) {
            filtered = filtered.filter(teacher =>
                teacher.languageLevel?.toLowerCase() === 'native'
            );
        }

        // Filtro por especialidad
        if (activeFilters.specialty) {
            filtered = filtered.filter(teacher =>
                teacher.subjectYouTeach?.toLowerCase().includes(activeFilters.specialty.toLowerCase())
            );
        }

        // Filtro por idioma
        if (activeFilters.language) {
            filtered = filtered.filter(teacher =>
                teacher.languages?.some(lang =>
                    lang.toLowerCase() === activeFilters.language.toLowerCase()
                )
            );
        }

        // Filtro por disponibilidad
        if (activeFilters.availability) {
            filtered = filtered.filter(teacher =>
                teacher.availability?.includes(activeFilters.availability)
            );
        }

        setFilteredTeachers(filtered);
    };

    const clearFilters = () => {
        setActiveFilters({
            priceRange: [10, 35],
            fullName: '',
            country: '',
            availability: '',
            specialty: '',
            language: '',
            isNative: false,
            category: ''
        });
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center text-xl p-4">{error}</div>;
    }

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
                clearFilters={clearFilters}
                filterOptions={filterOptions}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
            />

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
                                <h4 className="text-lg font-bold text-gray-800 line-clamp-1 flex items-center">
                                    <Flag code={teacher.countryOfBirth?.toUpperCase()} className="mr-2 w-6 h-4" />
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
            >
                {selectedTeacher && (
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
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
                            <div className="ml-6 flex-1">
                                <h4 className="text-xl font-bold text-gray-800">
                                    <Flag code={selectedTeacher.countryOfBirth?.toUpperCase()} className="mr-2 w-8 h-6" />
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
                                <h5 className="text-lg font-bold text-gray-700 mb-2">Información Personal</h5>
                        
                                <p className="text-gray-600">
                                    <span className="font-medium">País:</span> {selectedTeacher.countryOfBirth}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Idiomas:</span> {selectedTeacher.languages?.join(', ')}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Nivel de Idioma:</span> {selectedTeacher.languageLevel}
                                </p>
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-700 mb-2">Información Académica</h5>
                                <p className="text-gray-600">
                                    <span className="font-medium">Especialidad:</span> {selectedTeacher.subjectYouTeach}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Experiencia:</span> {selectedTeacher.yearsOfExperience} años
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
