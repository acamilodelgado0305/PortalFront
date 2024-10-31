import { useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebook, FaApple } from 'react-icons/fa';
import GoogleLogo from '../../assets/icons/icons8-logo-de-google.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { message } from 'antd';

const Login = ({setInicioSesion}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://back.app.esturio.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                console.log("Role:", data);
                // Llamada a `login` con el usuario y los tokens
                login(data.user, data.accessToken, data.idToken, data.refreshToken);

                // Redirección después del inicio de sesión exitoso
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

                {/* Encabezado de inicio de sesión */}
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

                {/* Botones de inicio de sesión con redes sociales */}
                <div className="mb-6">
                    <button className="w-full p-2 mb-3 border-2  border-black rounded-lg flex items-center justify-center text-red-600 font-semibold transition duration-200  hover:bg-red-200">
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

                {/* Campos de formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">

                        </label>
                        <input
                            className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                            type="email"
                            id="email"
                            placeholder="Introduce tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">

                        </label>
                        <input
                            className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            style={{ top: "50%", transform: "translateY(-50%)" }} // Centrar el icono verticalmente
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
                                <FaEyeSlash className="text-gray-400" />
                            ) : (
                                <FaEye className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Checkbox de recordar */}
                    <div className="mb-4 flex items-center">
                        <input
                            className="mr-2 leading-tight"
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="text-sm text-gray-700" htmlFor="rememberMe">
                            Recuérdame
                        </label>
                    </div>

                    {/* reCAPTCHA simulado */}
                    <div className="mb-4 flex justify-center">
                        <div className="bg-gray-200 w-full h-12 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">reCAPTCHA</p>
                        </div>
                    </div>

                    {/* Botón de Iniciar sesión */}
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
                    <a 
                    href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
                    <a
                     onClick={() => setInicioSesion(false)}
                    href="#" className="hover:underline">Regístrate</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
