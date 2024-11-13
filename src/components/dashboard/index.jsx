import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Spin, Avatar, List } from 'antd';
import { GraduationCapIcon, UsersIcon, BookOpenIcon, MapPinIcon } from 'lucide-react';

const COLORS = ['#1677ff', '#52c41a', '#722ed1', '#faad14', '#f5222d', '#13c2c2'];

const Dashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [teacherNationality, setTeacherNationality] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [teacherCountries, setTeacherCountries] = useState([]);
    const [languageData, setLanguageData] = useState([]);
    const [modalityData, setModalityData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teacherResponse, studentResponse] = await Promise.all([
                    fetch('https://back.app.esturio.com/api/teachers'),
                    fetch('https://back.app.esturio.com/api/students')
                ]);

                if (!teacherResponse.ok || !studentResponse.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const teacherData = await teacherResponse.json();
                const studentData = await studentResponse.json();

                setTeachers(teacherData.data || []);
                setStudents(studentData.data || []);

                setTeacherNationality(calculateDataByField(teacherData.data, 'countryOfBirth'));
                setTeacherSubjects(calculateDataByField(teacherData.data, 'subjectYouTeach'));
                setTeacherCountries(calculateDataByField(teacherData.data, 'country'));
                setLanguageData(calculateDataByField(studentData.data, 'idioma'));
                setModalityData(calculateDataByField(studentData.data, 'modalidad'));
                setCityData(calculateDataByField(studentData.data, 'ciudad'));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateDataByField = (data, field) => {
        if (!data || !Array.isArray(data)) return [];
        const countData = data.reduce((acc, item) => {
            const key = item[field];
            if (key) {
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.keys(countData)
            .map(key => ({ name: key, value: countData[key] }))
            .sort((a, b) => b.value - a.value);
    };

    const StatCard = ({ title, value, icon: Icon }) => (
        <Card bordered className="h-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-500" />
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // Obtener los últimos 5 profesores y estudiantes
    const recentTeachers = teachers
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const recentStudents = students
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="p-4">
            {/* Stats Overview */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Estudiantes"
                        value={students.length}
                        icon={GraduationCapIcon}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Profesores"
                        value={teachers.length}
                        icon={UsersIcon}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Materias"
                        value={teacherSubjects.length}
                        icon={BookOpenIcon}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Ciudades"
                        value={cityData.length}
                        icon={MapPinIcon}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Profesores por País - Top 5 y Otros */}
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered title="Profesores por País (Top 5)" bodyStyle={{ height: '240px', padding: '8px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teacherNationality.slice(0, 5)}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={COLORS[3]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    {teacherNationality.length > 5 && (
                        <Card bordered title="Profesores por País (Otros)" bodyStyle={{ height: '240px', padding: '8px', marginTop: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={teacherNationality.slice(5)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill={COLORS[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </Col>

                {/* Profesores por Materia - Top 5 y Otros */}
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered title="Profesores por Materia (Top 5)" bodyStyle={{ height: '240px', padding: '8px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teacherSubjects.slice(0, 5)}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={COLORS[2]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    {teacherSubjects.length > 5 && (
                        <Card bordered title="Profesores por Materia (Otros)" bodyStyle={{ height: '240px', padding: '8px', marginTop: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={teacherSubjects.slice(5)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill={COLORS[1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </Col>
            </Row>    <Row gutter={[16, 16]}>
                {/* Estudiantes por Idioma */}
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered title="Estudiantes por Idioma" bodyStyle={{ height: '240px', padding: '8px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={languageData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    label
                                >
                                    {languageData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Estudiantes por Modalidad */}
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered title="Estudiantes por Modalidad" bodyStyle={{ height: '240px', padding: '8px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={modalityData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Profesores por Nacionalidad */}
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered title="Profesores por Nacionalidad" bodyStyle={{ height: '240px', padding: '8px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={teacherNationality.slice(0, 5)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    label
                                >
                                    {teacherNationality.slice(0, 5).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} lg={12}>
                    <Card bordered title="Profesores Recientes" className="h-full">
                        <List
                            itemLayout="horizontal"
                            dataSource={recentTeachers}
                            renderItem={teacher => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={teacher.profileImageUrl || `/api/placeholder/32/32`}
                                                size="large"
                                            />
                                        }
                                        title={`${teacher.firstName} ${teacher.lastName}`}
                                        description={`${teacher.subjectYouTeach} - ${teacher.countryOfBirth}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
