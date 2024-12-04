import { useState } from "react";
import { FaApple, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { message, Spin, Progress, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { verifyEmail } from "../../../services/validations";
import { codeStudentCognito, createStudentCognito, resendCodeCognito } from "../../../services/studendent.services";
import GoogleLogo from '../../../assets/icons/icons8-logo-de-google.svg';
import { useNavigate } from 'react-router-dom';

const Register = ({ selectedTeacher, closeRegisterModal, setInicioSesion }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName ] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [receiveCode, setReceiveCode] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [loadingNewCode, setLoadingNewCode] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const success = (msg, type) => {
    message.open({ type, content: msg, style: { marginTop: "20vh" } });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 33;
    if (/[0-9]/.test(password)) strength += 33;
    if (/[@$!%*?&]/.test(password)) strength += 34;
    setPasswordStrength(Math.min(strength, 100));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!verifyEmail(email)) {
      success("Correo inválido", "warning");
      return;
    }
    if (!acceptedTerms) {
      success("Debes aceptar los términos y condiciones", "warning");
      return;
    }

    calculatePasswordStrength(password);
    if (passwordStrength < 100) {
      success("La contraseña no cumple con los requisitos", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await createStudentCognito({ email, password, role: "student", name, lastName, profileImageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVWEVLolIV4bhei6NmC_4Q7gVdygDmvdDdRA&s" });
      if (response.success) {
        setReceiveCode(true);
        success("Revisa tu correo para confirmar tu registro", "success");
      } else {
        success(response.message, "error");
      }
    } catch (error) {
      console.error('Error creando usuario:', error.response ? error.response.data : error.message);
      success("Error en el registro", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!code || code.length < 6) {
      success("Código inválido", "warning");
      return;
    }

    setLoadingSendCode(true);
    try {
      const response = await codeStudentCognito({ email, code });
      if (response.success) {
        success("Registro confirmado", "success");
        navigate('/login');
      } else {
        success(response.message, "warning");
      }
    } catch (error) {
      success("Error al confirmar el código", "error");
    } finally {
      setLoadingSendCode(false);
    }
  };

  const handleResendCode = async () => {
    setLoadingNewCode(true);
    try {
      const response = await resendCodeCognito({ email });
      success(response.message, response.success ? "success" : "error");
    } catch (error) {
      success("Error al reenviar código", "error");
    } finally {
      setLoadingNewCode(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {receiveCode ? "Verifica tu Código" : "Regístrate"}
        </h2>

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

        {!receiveCode ? (
          <form onSubmit={handleRegister}>     
          <div className="mb-4 flex gap-2">
              <input
                className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                type="name"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
                    <input
                className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                type="lastName"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  calculatePasswordStrength(e.target.value);
                }}
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer mb-[15%]"
                onClick={() => setPasswordVisible(!passwordVisible)}

              >
                {passwordVisible ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </div>
              <Progress percent={passwordStrength} size="small" showInfo={false} />
              <p className="text-xs text-gray-500 mt-1">
                La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.
              </p>
            </div>
            <div className="mb-4">
              <Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)}>
                Acepto los términos y condiciones
              </Checkbox>
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 border-2 border-purple-500"
            >
              {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "Registrarme"}
            </button>
          </form>
        ) : (
          <div>
            <div className="grid justify-items-center grid-cols-1 pl-8 pr-8">
              <div className="flex gap-4 flex-wrap justify-center">
                <input onChange={(e) => setCode(e.target.value)} maxLength={6} className="w-10/12 border border-black rounded-md outline-none p-2 text-sm" type="text" name="1" id="" />

              </div>
              <p className="text-sx mt-2 text-center">Ingresa el codigo que llego a tu correo</p>
            </div>
            <button
              onClick={handleSendCode}
              className="w-full p-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 border-2 border-purple-500 mt-4"
            >
              {loadingSendCode ? <Spin indicator={<LoadingOutlined spin />} /> : "Enviar código"}
            </button>
            <button onClick={handleResendCode} className="underline text-center block w-full text-blue-500 cursor-pointer mt-2">
              Obtener un nuevo código
            </button>
          </div>
        )}

        <div className="flex justify-center text-gray-600 text-sm mt-4">
          <p>¿Ya tienes cuenta?</p>
          <button onClick={() => navigate('/login')} className="text-blue-500 underline ml-1">
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
