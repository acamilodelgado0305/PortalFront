import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // Redirigir a login si no hay token
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
