import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

const StudentsSection = () => {
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Función para obtener los estudiantes desde la API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/students');
                if (!response.ok) throw new Error('Error al obtener los datos de estudiantes');

                const data = await response.json();
                setStudents(data.data || []); // Asignar los datos obtenidos de la API
            } catch (error) {
                console.error('Error al cargar los datos de estudiantes:', error);
            }
        };

        fetchStudents();
    }, []);

    const showModal = (student) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Componente de la tarjeta del estudiante
    const StudentCard = ({ student }) => (
        <div className="bg-white p-4 shadow rounded-md flex flex-col justify-between w-64 m-4">
            <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="ml-4">
                    <h4 className="text-lg font-bold">{student.nombre}</h4>
                    <p className="text-sm text-gray-500">Materias: {student.subjects?.join(", ") || "No especificado"}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Próxima clase: {student.nextLesson || "No programada"}</p>
                <Button
                    type="primary"
                    style={{ backgroundColor: '#6B46C1', borderColor: '#6B46C1' }}
                    onClick={() => showModal(student)}
                >
                    Ver detalles
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">My Students</h1>
            <div className="flex flex-wrap">
                {students.map(student => (
                    <StudentCard key={student.id} student={student} />
                ))}
            </div>

            {/* Modal para mostrar detalles del estudiante */}
            <Modal
                title="Detalles del Estudiante"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>Cancelar</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>OK</Button>,
                ]}
            >
                {selectedStudent && (
                    <div>
                        <p><strong>Nombre:</strong> {selectedStudent.nombre}</p>
                        <p><strong>Materias:</strong> {selectedStudent.subjects?.join(", ") || "No especificado"}</p>
                        <p><strong>Próxima Lección:</strong> {selectedStudent.nextLesson || "No programada"}</p>
                        <p><strong>Idioma:</strong> {selectedStudent.idioma || "No especificado"}</p>
                        <p><strong>Modalidad:</strong> {selectedStudent.modalidad || "No especificado"}</p>
                        <p><strong>Ciudad:</strong> {selectedStudent.ciudad || "No especificado"}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StudentsSection;
