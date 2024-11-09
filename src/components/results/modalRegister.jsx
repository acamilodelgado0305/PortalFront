import { useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { message, Spin, Progress, Checkbox, Modal } from "antd";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { Eye, EyeOff } from 'lucide-react';
import { verifyEmail } from "../../services/validations";
import { codeStudentCognito, createStudentCognito, resendCodeCognito } from "../../services/studendent.services";

import GoogleLogo from '../../assets/icons/icons8-logo-de-google.svg';

const ModalRegister = ({ isOpen, onClose, setInicioSesion }) => {
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
  const [isFocused, setIsFocused] = useState(false);

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
      const response = await createStudentCognito({ email, password, role: "student" });
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
        onClose();
        setInicioSesion(true);
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

  const modalTitle = (
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold">
        {receiveCode ? "Verifica tu Código" : "Regístrate"}
      </span>
    </div>
  );

  const PasswordInput = () => (
    <div className="mb-4 space-y-2">
      <div className="relative">
        <input
          type={passwordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            calculatePasswordStrength(e.target.value);
          }}
          className={`w-full px-4 py-2 pr-12 rounded-lg border-2 transition-all duration-200 text-center
            placeholder:text-gray-400 focus:outline-none bg-white
            ${isFocused
              ? "border-purple-500 ring-2 ring-purple-100"
              : "border-black"}`
          }
          placeholder="Introduce tu contraseña"
          required
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Contraseña"
        />

        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2
            p-1 rounded-full transition-all duration-200
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400
            text-gray-500 hover:text-gray-700"
          aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {passwordVisible ? (
            <EyeOff className="w-5 h-5 transition-transform duration-200 ease-in-out" />
          ) : (
            <Eye className="w-5 h-5 transition-transform duration-200 ease-in-out" />
          )}
        </button>
      </div>

      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out
            ${passwordStrength < 33
              ? "bg-red-500"
              : passwordStrength < 66
                ? "bg-yellow-500"
                : "bg-green-500"}`
          }
          style={{ width: `${passwordStrength}%` }}
          role="progressbar"
          aria-valuenow={passwordStrength}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <p className="text-xs text-gray-600">
        La contraseña debe tener al menos:
        <span className="block mt-1 ml-2">
          • 8 caracteres<br />
          • Un número<br />
          • Un carácter especial
        </span>
      </p>
    </div>
  );


  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      closeIcon={<CloseOutlined className="text-black" />}
      centered
    >
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

          <PasswordInput />

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
              <input
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-10/12 border border-black rounded-md outline-none p-2 text-sm"
                type="text"
              />
            </div>
            <p className="text-sx mt-2 text-center">Ingresa el código que llegó a tu correo</p>
          </div>
          <button
            onClick={handleSendCode}
            className="w-full p-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 border-2 border-purple-500 mt-4"
          >
            {loadingSendCode ? <Spin indicator={<LoadingOutlined spin />} /> : "Enviar código"}
          </button>
          <button
            onClick={handleResendCode}
            className="underline text-center block w-full text-blue-500 cursor-pointer mt-2"
          >
            {loadingNewCode ? <Spin indicator={<LoadingOutlined spin />} /> : "Obtener un nuevo código"}
          </button>
        </div>
      )}

      <div className="flex justify-center text-gray-600 text-sm mt-4">
        <p>¿Ya tienes cuenta?</p>
        <button
          onClick={() => {
            onClose();
            setInicioSesion(true);
          }}
          className="text-blue-500 underline ml-1"
        >
          Inicia sesión
        </button>
      </div>
    </Modal>
  );
};

export default ModalRegister;