import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getAllUsersLanding } from '../../../services/studendent.services';
import * as XLSX from 'xlsx';

function UsersLandingList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Obtener usuarios al montar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {

                const response = await getAllUsersLanding();
                console.log("user landing", response)
                setUsers(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Columnas para la tabla
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'email',
            key: 'email',
        },
    ];

    // Descargar la data en Excel
    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

        // Generar el archivo Excel
        XLSX.writeFile(workbook, 'UsuariosLanding.xlsx');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Usuarios Landing</h2>

            <div className="mb-4">
                <Button type="primary" onClick={handleDownloadExcel}>
                    Descargar Excel
                </Button>
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default UsersLandingList;
