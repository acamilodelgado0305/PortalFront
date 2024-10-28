import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // Redirigir a login si no hay token
        return <Navigate to="/login" />;
    }

    return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
