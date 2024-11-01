// src/pages/RegisterPage.jsx
import Register from '../auth/components/register';

const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <Register />
            </div>
        </div>
    );
};

export default RegisterPage;
