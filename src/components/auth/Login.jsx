import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);  // Para el checkbox de "Recuérdame"
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

                {/* Encabezado de inicio de sesión */}
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

                {/* Botones de inicio de sesión con redes sociales (sin color de fondo) */}
                <div className="mb-6">
                    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
                        <FaGoogle className="mr-2 text-red-500" /> {/* El icono de Google con sus colores */}
                        Continuar con Google
                    </button>
                    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
                        <FaFacebook className="mr-2 text-blue-600" /> {/* El icono de Facebook en azul */}
                        Continuar con Facebook
                    </button>
                    <button className="w-full p-2 border rounded-lg flex items-center justify-center">
                        <FaApple className="mr-2 text-black" /> {/* El icono de Apple en negro */}
                        Continuar con Apple
                    </button>
                </div>

                <div className="text-center text-gray-500 mb-4">o</div>

                {/* Campos de formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Dirección de correo
                        </label>
                        <input
                            className="w-full p-2 border rounded-lg focus:outline-none"
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
                            Contraseña
                        </label>
                        <input
                            className="w-full p-2 border rounded-lg focus:outline-none"
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
                                <FaEyeSlash className="text-gray-400 mt-7" />
                            ) : (
                                <FaEye className="text-gray-400 mt-7" />
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
                            className="w-full p-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>

                <div className="flex justify-between text-gray-600 text-sm mt-4">
                    <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
                    <a href="#" className="hover:underline">Regístrate</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
