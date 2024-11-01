import { useEffect, useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { verifyEmail, verifyNumber } from "../../services/validations";
import { codeStudentCognito, createStudent, createStudentCognito, resendCodeCognito } from "../../services/studendent.services";
import { FormRegister } from "./components/formRegister";
import { CodeVerify } from "./components/codeVerify";
import { Button, message, notification, Space, Spin, Progress, Input } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { HomeStudent } from "./components/homeStudent";

export const Register = ({selectedTeacher, closeRegisterModal, setInicioSesion}) => {
  const [manejoDatos, setManejoDatos] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState(false);
  const [receiveCode, setReceiveCode] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingNewCode, setLoadingNewCode] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);

  // provisional
  const [gohome, setgoHome] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[@$!%*?&]/.test(password)) strength += 25;
    setPasswordStrength(Math.min(strength, 100));
  };

  const onchangeData = async (data) => {
    data.preventDefault();
    const dataForm = Object.fromEntries(new FormData(data.target));
    if (!dataForm.manejoDatos) {
      setManejoDatos(true);
      return;
    }
    setManejoDatos(false);

    if (!verifyEmail(dataForm.email)) return;
    calculatePasswordStrength(dataForm.password);

    if (passwordStrength < 100) {
      success("La contraseña no cumple con los requisitos", "warning");
      return;
    }

    setLoading(true);
    const cognitoStuden = {
      email: dataForm.email,
      password: dataForm.password,
      role: "studen",
    };
    setEmail(dataForm.email);

    try {
      const resCode = await createStudentCognito(cognitoStuden);
      if (!resCode.success) return;
      setReceiveCode(true);
      success("Revisa tu correo para confirmar tu registro", "success");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response.data.message) {
        success(error.response.data.message, "warning");
        setReceiveCode(true);
      }
    }
  };

  const sendCode = async () => {
    if (!code || code.length < 6) {
      success("Código inválido", "warning");
      return;
    }

    const codeUser = { email, code };
    setLoadingSendCode(true);
    try {
      const response = await codeStudentCognito(codeUser);
      setLoadingSendCode(false);
      if (response.success) {
        success(response.message, "success");
        setgoHome(true);
      } else {
        success(response.message, "warning");
      }
    } catch (error) {
      success(error.response.data.message, "warning");
      setLoadingSendCode(false);
    }
  };

  const resendCode = async () => {
    setLoadingNewCode(true);
    try {
      const response = await resendCodeCognito({ email: email });
      setLoadingNewCode(false);
      success(response.success ? response.message : "Error al reenviar código", response.success ? "success" : "warning");
    } catch (error) {
      console.log(error.response);
      setLoadingNewCode(false);
    }
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = (message, estado) => {
    messageApi.open({
      type: estado,
      content: message,
      style: { marginTop: '20vh' },
    });
  };

  return (
    <>
      {gohome ? (
        <HomeStudent closeRegisterModal={closeRegisterModal} />
      ) : (
        <>
          {contextHolder}
          <div className="w-11/12 md:w-3/12 rounded-lg bg-white p-6 shadow-lg font-normal z-40 relative">
            <buttom
              onClick={() => closeRegisterModal(null)}
              className="mr-2 text-3xl"
            />
               

                <button onClick={() => closeRegisterModal(null)}
              className="mr-2 text-3xl"> ← </button>
                
            <div className="w-full grid justify-items-center grid-cols-1 border-b mb-3">
              <div className="w-[90px] h-[90px] rounded-md ">
                <img className="rounded-2xl" src={selectedTeacher.profileImageUrl} alt="Teacher" />
              </div>
              <p className="text-sm">Aprende más con el profesor {selectedTeacher.firstName}</p>
            </div>
            <form onSubmit={onchangeData} className="p-5 text-sm md:text-xs">
              <h2 className="text-lg font-bold text-center mb-3">Regístrate</h2>
              <div className="mb-6 text-sm">
                <Button className="w-full mb-3 flex items-center justify-center">
                  <FaGoogle className="mr-2 text-red-500" />
                  Continuar con Google
                </Button>
                <Button className="w-full mb-3 flex items-center justify-center">
                  <FaFacebook className="mr-2 text-blue-600" />
                  Continuar con Facebook
                </Button>
              </div>
              <div className="p-2 border rounded text-sm">
                {!receiveCode ? (
                  <FormRegister
                    setVerifyPassword={setVerifyPassword}
                    manejoDatos={manejoDatos}
                  />
                ) : (
                  <CodeVerify setCode={setCode} />
                )}
              </div>
              {receiveCode ? (
                <div className="grid justify-items-center gap-4">
                  {loadingNewCode || loadingSendCode ? (
                    <Spin indicator={<LoadingOutlined spin />} size="large" className="m-auto" />
                  ) : (
                    <>
                      <Button onClick={sendCode} className="w-[130px]" type="primary">Enviar código</Button>
                      <span onClick={resendCode} className="underline cursor-pointer">Obtener un nuevo código</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex justify-center gap-3 mt-3">
                  <Button type="primary" htmlType="submit">Registrarme</Button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
};
