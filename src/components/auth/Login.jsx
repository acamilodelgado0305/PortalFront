import { useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebook, FaApple } from 'react-icons/fa';
import GoogleLogo from '../../assets/icons/icons8-logo-de-google.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { message } from 'antd';

const Login = ({ closeRegisterModal, setInicioSesion }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
// http://localhost:4005/api/users/login
// https://back.app.esturio.com/api/users/login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4005/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (data.success) {
                login(data.user, data.accessToken, data.idToken, data.refreshToken);
                console.log('Usuario Logueado: '+JSON.stringify(data))
                navigate('/dashboard');
            } else {
                message.error('Error en el inicio de sesión: ' + (data.message || 'Credenciales incorrectas'));
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            message.error('Error en el servidor. Intente de nuevo más tarde.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

                <div className="mb-6">
                    <button className="w-full p-2 mb-3 border-2 border-black rounded-lg flex items-center justify-center text-red-600 font-semibold transition duration-200 hover:bg-red-200">
                        <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
                        Continuar con Google
                    </button>
                    <button className="w-full p-2 mb-3 border-2 border-black rounded-lg flex items-center justify-center text-blue-600 font-semibold hover:bg-blue-100">
                        <FaFacebook size={24} className="mr-2" />
                        Continuar con Facebook
                    </button>
                    <button className="w-full p-2 border-2 border-black rounded-lg flex items-center justify-center text-black font-semibold hover:bg-gray-200">
                        <FaApple size={24} className="mr-2" />
                        Continuar con Apple
                    </button>
                </div>

                <div className="text-center text-gray-500 mb-4">o</div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                            type="email"
                            placeholder="Introduce tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                        </div>
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            className="mr-2 leading-tight"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="text-sm text-gray-700">Recuérdame</label>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full p-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 border-2 border-purple-500"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>

                <div className="flex justify-between text-gray-600 text-sm mt-4">
                    <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
                    <a
                        onClick={() => navigate('/register')}
                        href="#"
                        className="hover:underline"
                    >
                        Regístrate
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
