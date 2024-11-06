import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, Typography, CircularProgress, Grid, Box } from '@mui/material';

const Dashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [teacherNationality, setTeacherNationality] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://back.app.esturio.com/api/teachers');
                if (!response.ok) throw new Error('Error al obtener los datos de profesores');

                const data = await response.json();
                setTeachers(data.data || []);

                setTeacherNationality(calculateNationalityData(data.data));
                setTeacherSubjects(calculateSubjectData(data.data));
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateNationalityData = (teachers) => {
        const nationalityCount = teachers.reduce((acc, { countryOfBirth }) => {
            acc[countryOfBirth] = (acc[countryOfBirth] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(nationalityCount).map(nationality => ({ name: nationality, value: nationalityCount[nationality] }));
    };

    const calculateSubjectData = (teachers) => {
        const subjectCount = teachers.reduce((acc, { subjectYouTeach = "Unknown" }) => {
            acc[subjectYouTeach] = (acc[subjectYouTeach] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(subjectCount).map(subject => ({ name: subject, value: subjectCount[subject] }));
    };

    const sampleStudents = 150;
    const sampleCourses = 10;
    const samplePayments = [
        { month: "Agosto", amount: 1200 },
        { month: "Septiembre", amount: 2100 },
        { month: "Octubre", amount: 1800 },
        { month: "Noviembre", amount: 2300 }
    ];
    const studentGrowthData = [
        { month: "Agosto", students: 120 },
        { month: "Septiembre", students: 140 },
        { month: "Octubre", students: 150 },
        { month: "Noviembre", students: 160 }
    ];

    return (
        <Box sx={{ padding: 3 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Total de Estudiantes
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {sampleStudents}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Total de Cursos
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {sampleCourses}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardHeader title="Profesores por Nacionalidad" />
                            <CardContent>
                                <PieChart width={300} height={200}>
                                    <Pie
                                        data={teacherNationality}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        label
                                        isAnimationActive={true}
                                        animationDuration={1000} // Duración de la animación en milisegundos
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

                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardHeader title="Pagos de Contabilidad" />
                            <CardContent>
                                <BarChart width={300} height={200} data={samplePayments}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="amount"
                                        fill="#8884d8"
                                        isAnimationActive={true}
                                        animationDuration={3000} // Duración de la animación
                                    />
                                </BarChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardHeader title="Profesores por Materia" />
                            <CardContent>
                                <BarChart width={300} height={200} data={teacherSubjects}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        fill="#8884d8"
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                    />
                                </BarChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardHeader title="Crecimiento de Estudiantes Mensual" />
                            <CardContent>
                                <LineChart width={300} height={200} data={studentGrowthData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="students"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                    />
                                </LineChart>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;
