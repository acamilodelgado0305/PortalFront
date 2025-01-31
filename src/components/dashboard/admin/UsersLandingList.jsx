import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getAllUsersLanding } from '../../../services/studendent.services';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const DEFAULT_DATE = dayjs('2025-01-25T00:00:00Z');

function UsersLandingList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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
            } catch (error) {
                console.error('Error obteniendo usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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
            sorter: (a, b) => dayjs(a.createdAt, 'DD/MM/YYYY').unix() - dayjs(b.createdAt, 'DD/MM/YYYY').unix(),
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

            <div className="mb-4">
                <Button type="primary" onClick={handleDownloadExcel} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Descargar Excel
                </Button>
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
