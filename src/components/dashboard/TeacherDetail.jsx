import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const TeacherDetail = () => {
    const { id } = useParams(); // Obtener el ID del profesor desde la URL
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await fetch(`https://back.app.esturio.com/api/teachers/${id}`);
                const data = await response.json();
                setTeacher(data.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar detalles del profesor');
                setLoading(false);
            }
        };
        fetchTeacherDetails();
    }, [id]);

    if (loading) return <Spin tip="Cargando detalles..." className="flex justify-center items-center min-h-screen" />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 relative">
                <div className="absolute top-4 left-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="primary"
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                    >
                        Regresar
                    </Button>
                </div>

                {teacher && (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-6 text-gray-800">
                            {teacher.firstName} {teacher.lastName}
                        </h1>
                        <img
                            src={teacher.profileImageUrl}
                            alt="Perfil"
                            className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                        />

                        <p className="text-gray-600 mb-2"><strong>Email:</strong> {teacher.email}</p>
                        <p className="text-gray-600 mb-2"><strong>Tarifa por hora:</strong> ${teacher.hourlyRate}</p>
                        <p className="text-gray-600 mb-2"><strong>Comisión:</strong> ${teacher.commissionAmount} ({teacher.commissionRate * 100}%)</p>
                        <p className="text-gray-600 mb-2"><strong>Idiomas:</strong> {teacher.language}</p>
                        <p className="text-gray-600 mb-4"><strong>Descripción:</strong> {teacher.description?.introduction}</p>

                        {teacher.video && (
                            <div className="my-6">
                                <h2 className="text-xl font-bold mb-4">Video de presentación</h2>
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                        src={teacher.video}
                                        title="Video de presentación"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-64 rounded-md"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Disponibilidad</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-600">
                            {teacher.Availability && Object.entries(teacher.Availability).map(([day, availability]) => (
                                <div key={day} className="p-3 border rounded-md">
                                    <p className="font-bold">{day}:</p>
                                    <p>{availability.enabled ? "Disponible" : "No disponible"}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Certificaciones</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {teacher.certifications?.map(cert => (
                                <div key={cert.fileName} className="p-4 border rounded-lg text-gray-600">
                                    <p className="font-bold text-lg">{cert.subject}</p>
                                    <p>({cert.studyStart} - {cert.studyEnd})</p>
                                    <img src={cert.fileUrl} alt={cert.fileName} className="w-20 h-20 mt-2 object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDetail;
