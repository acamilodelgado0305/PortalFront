import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import KeyIcon from '../../assets/icons/key1.svg';  // Ajusta la ruta si es necesario
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();  // Para la redirección

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Función para manejar el envío del formulario de login
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

            // Si la autenticación es exitosa, almacenar el token y redirigir
            if (data.success) {
                console.log('Token recibido:', data.token);
                // Almacenar el token en el localStorage
                localStorage.setItem('token', data.token);

                // Redirigir al dashboard
                navigate('/dashboard');
            } else {
                alert('Error en el inicio de sesión: ' + (data.message || 'Credenciales incorrectas'));
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            alert('Error en el servidor. Intente de nuevo más tarde.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-purple-300">
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-8 w-96">

                {/* Campos de formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                            User
                        </label>
                        <input
                            className="w-full p-2 text-gray-900 rounded-lg bg-opacity-50 focus:outline-none"
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full p-2 text-gray-900 rounded-lg bg-opacity-50 focus:outline-none"
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
                                <FaEyeSlash className="text-gray-400 mt-6" />
                            ) : (
                                <FaEye className="text-gray-400 mt-6" />
                            )}
                        </div>
                    </div>

                    {/* Ícono de llave como botón de login */}
                    <div className="text-center mt-6">
                        <button type="submit">
                            <img src={KeyIcon} alt="Key Icon" className="mx-auto w-16 h-16 cursor-pointer" />
                        </button>
                    </div>
                </form>

                <div className="flex justify-between text-white text-sm mt-4">
                    <a href="#" className="hover:underline">Forgot password</a>
                    <a href="#" className="hover:underline">Change password</a>
                    <a href="#" className="hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
