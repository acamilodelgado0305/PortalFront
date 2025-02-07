import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crear contexto
const AuthContext = createContext();

// Custom hook para usar el contexto de autenticación fácilmente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [idToken, setIdToken] = useState(localStorage.getItem('idToken') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
    const [dashboard, setDashboard] = useState(localStorage.getItem('dashboard') || null);

    // Función para almacenar el usuario y los tokens
    const login = (userData, access, id, refresh) => {
        setUser(userData);
        setAccessToken(access);
        setIdToken(id);
        setRefreshToken(refresh);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', access);
        localStorage.setItem('idToken', id);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('dashboard', "results");
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setIdToken(null);
        setRefreshToken(null);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('dashboard');

    };

    const handleDashboard = (change) => {
          if (change == "results") {
            localStorage.setItem('dashboard', "teachers");
            setDashboard("teachers");
        } else {
            localStorage.setItem('dashboard', "results");
            setDashboard("results");
          }
    }

    return (
        <AuthContext.Provider value={{ user, accessToken, idToken, refreshToken, login, logout, handleDashboard, dashboard }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
