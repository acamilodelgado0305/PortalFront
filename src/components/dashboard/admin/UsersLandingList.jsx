import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { getAllUsersLanding } from '../../../services/studendent.services';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const DEFAULT_DATE = dayjs('2025-01-25T00:00:00Z');

function UsersLandingList() {
    const [users, setUsers] = useState([]);  // Usuarios a mostrar
    const [allUsers, setAllUsers] = useState([]);  // Todos los usuarios (sin filtrar)
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString) => {
        if (!dateString || !dayjs(dateString).isValid()) {
            return DEFAULT_DATE.format('DD/MM/YYYY');
        }
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getAllUsersLanding();
                console.log("Usuarios Landing:", response);
                const formattedUsers = response.map(user => ({
                    ...user,
                    createdAt: formatDate(user.createdAt)
                }));
                setUsers(formattedUsers);
                setAllUsers(formattedUsers); // Guardamos todos los usuarios
            } catch (error) {
                console.error('Error obteniendo usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const monthColors = {
        0: "text-purple-700",   // Enero - Morado intenso
        1: "text-blue-700",     // Febrero - Azul fuerte
        2: "text-teal-800",     // Marzo - Verde azulado fuerte
        3: "text-green-800",    // Abril - Verde fuerte
        4: "text-yellow-800",   // Mayo - Amarillo fuerte
        5: "text-orange-800",   // Junio - Naranja fuerte
        6: "text-red-800",      // Julio - Rojo fuerte
        7: "text-pink-800",     // Agosto - Rosa fuerte
        8: "text-indigo-800",   // Septiembre - Índigo fuerte
        9: "text-gray-800",     // Octubre - Gris fuerte
        10: "text-lime-800",    // Noviembre - Lima fuerte
        11: "text-cyan-800",    // Diciembre - Cian fuerte
    };

    // Lista de meses para el filtro
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handleMonthFilter = (value) => {
        if (value) {
            const filteredUsers = allUsers.filter(user => {
                const month = dayjs(user.createdAt, 'DD/MM/YYYY').month();
                return month === value;
            });
            setUsers(filteredUsers);
        } else {
            // Si no hay filtro, mostramos todos los usuarios
            setUsers(allUsers);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            setUsers(allUsers); // Si está vacío, mostramos todos los usuarios
        } else {
            const filteredUsers = allUsers.filter(user => {
                return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
            });
            setUsers(filteredUsers); // Filtramos los usuarios según el término
        }
    };

    const columns = [
        {
            title: <span className="text-blue-700 text-lg font-bold">Nombre</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <span className="text-green-700 text-lg font-bold">Correo Electrónico</span>,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: <span className="text-red-700 text-lg font-bold">Fecha de Creación</span>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                const month = dayjs(text, 'DD/MM/YYYY').month(); // Extrae el mes de la fecha
                return <span className={`${monthColors[month]} font-semibold`}>{text}</span>;
            },
            filters: months.map((month, index) => ({
                text: month,
                value: index
            })),
            onFilter: (value, record) => {
                const month = dayjs(record.createdAt, 'DD/MM/YYYY').month();
                return month === value;
            }
        }
    ];

    const handleDownloadExcel = () => {
        const excelData = users.map(user => ({
            Nombre: user.name,
            Email: user.email,
            'Fecha de Creación': user.createdAt
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
        XLSX.writeFile(workbook, 'UsuariosLanding.xlsx');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Usuarios Landing</h2>

            <div className="mb-4 flex justify-between items-center">
                <Button type="primary" onClick={handleDownloadExcel} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Descargar Excel
                </Button>

                <Input
                    placeholder="Buscar por nombre o correo"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-60"
                />
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="shadow-md rounded-lg"
            />
        </div>
    );
}

export default UsersLandingList;
