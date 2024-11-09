import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, Typography, CircularProgress, Grid, Box } from '@mui/material';

const Dashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [teacherNationality, setTeacherNationality] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [languageData, setLanguageData] = useState([]);
    const [modalityData, setModalityData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Realizar ambas solicitudes en paralelo
                const [teacherResponse, studentResponse] = await Promise.all([
                    fetch('https://back.app.esturio.com/api/teachers'),
                    fetch('https://back.app.esturio.com/api/students')
                ]);

                if (!teacherResponse.ok) throw new Error('Error al obtener los datos de profesores');
                if (!studentResponse.ok) throw new Error('Error al obtener los datos de estudiantes');

                const teacherData = await teacherResponse.json();
                const studentData = await studentResponse.json();

                setTeachers(teacherData.data || []);
                setStudents(studentData.data || []);

                // Calcular datos para gráficos
                setTeacherNationality(calculateDataByField(teacherData.data, 'countryOfBirth'));
                setTeacherSubjects(calculateDataByField(teacherData.data, 'subjectYouTeach'));
                setLanguageData(calculateDataByField(studentData.data, 'idioma'));
                setModalityData(calculateDataByField(studentData.data, 'modalidad'));
                setCityData(calculateDataByField(studentData.data, 'ciudad'));
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para calcular datos para gráficos
    const calculateDataByField = (data, field) => {
        const countData = data.reduce((acc, item) => {
            const key = item[field];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(countData).map(key => ({ name: key, value: countData[key] }));
    };

    return (
        <Box sx={{ padding: 3 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* Total de Estudiantes */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Total de Estudiantes
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {students.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Total de Profesores */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Total de Profesores
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {teachers.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Estudiantes por Idioma */}
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Estudiantes por Idioma
                                </Typography>
                                <PieChart width={250} height={250}>
                                    <Pie
                                        data={languageData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        label
                                    >
                                        {languageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Estudiantes por Modalidad */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Estudiantes por Modalidad
                                </Typography>
                                <BarChart width={300} height={200} data={modalityData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Estudiantes por Ciudad */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Estudiantes por Ciudad
                                </Typography>
                                <BarChart width={300} height={200} data={cityData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Profesores por Nacionalidad */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Profesores por Nacionalidad
                                </Typography>
                                <PieChart width={250} height={250}>
                                    <Pie
                                        data={teacherNationality}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {teacherNationality.map((entry, index) => (
                                            <Cell key={`cell-${index}`} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Profesores por Materia */}
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Profesores por Materia
                                </Typography>
                                <BarChart width={300} height={200} data={teacherSubjects}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;
