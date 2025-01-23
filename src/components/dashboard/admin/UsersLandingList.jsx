import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { getAllUsersLanding } from '../../../services/studendent.services';

function UsersLandingList() {
    const [users, setUsers] = useState([]);

    // Función para obtener los usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersLanding();
                console.log("user landing", response)
                setUsers(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Usuarios Landing</h2>
            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <span className="text-lg font-semibold">{user.name}</span>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay usuarios disponibles.</p>
                )}
            </div>
            <Button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                Actualizar Lista
            </Button>
        </div>
    );
}

export default UsersLandingList;
