import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

// Datos simulados para estudiantes
const sampleStudents = [
    { id: 1, name: "Adriana Patricia Benítez Sánchez", subjects: ["Informática"], nextLesson: "2024-10-25", img: null },
    { id: 2, name: "Efraín Gonzalez", subjects: ["Programación", "Informática"], nextLesson: "2024-10-26", img: null },
    { id: 3, name: "Juan Camilo", subjects: ["Programación"], nextLesson: "2024-10-27", img: null },
    { id: 4, name: "Sarah García", subjects: ["Programación", "TIC"], nextLesson: "2024-10-28", img: null },
    { id: 5, name: "Pedro Turriago", subjects: ["Programación"], nextLesson: "2024-10-29", img: null }
];

const StudentsSection = () => {
    const [students, setStudents] = useState(sampleStudents);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Esta función simula la llamada a la API para obtener estudiantes
    // En el futuro, puedes conectar esto a una API
    useEffect(() => {
        const fetchStudents = async () => {
            // Simulación de API usando los datos ficticios
            // En el futuro, puedes reemplazar esto con una llamada a una API
            // Ejemplo:
            // const response = await fetch('https://api.tu-sitio.com/students');
            // const data = await response.json();
            // setStudents(data);
            setStudents(sampleStudents); // Usamos datos ficticios por ahora
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
                    <h4 className="text-lg font-bold">{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.subjects.join(", ")}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Next lesson: {student.nextLesson}</p>
                <Button
                    type="primary"
                    style={{ backgroundColor: '#6B46C1', borderColor: '#6B46C1' }} // '#6B46C1' es el valor HEX de `bg-purple-500`
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
                        <p><strong>Nombre:</strong> {selectedStudent.name}</p>
                        <p><strong>Materias:</strong> {selectedStudent.subjects.join(", ")}</p>
                        <p><strong>Próxima Lección:</strong> {selectedStudent.nextLesson}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StudentsSection;
