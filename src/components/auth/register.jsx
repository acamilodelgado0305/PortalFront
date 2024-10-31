import { useEffect, useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { verifyEmail, verifyNumber } from "../../services/validations";
import { codeStudentCognito, createStudent, createStudentCognito, resendCodeCognito } from "../../services/studendent.services";
import { FormRegister } from "./components/formRegister";
import { CodeVerify } from "./components/codeVerify";
import { Button, message, notification, Space, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { HomeStudent } from "./components/homeStudent";

export const Register = ({selectedTeacher, closeRegisterModal, setInicioSesion}) => {
  const [manejoDatos, setManejoDatos] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [verifyPassword, setVerifyPassword]= useState(false);
  const [receiveCode, setReceiveCode]= useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading]= useState(false);
  const [loadingNewCode, setLoadingNewCode]= useState(false);
  const [loadingSendCode, setLoadingSendCode]= useState(false);

  // provisional
  const [gohome, setgoHome] = useState(false);

  
  
  const onchangeData = async (data) => {
    data.preventDefault();
    const dataForm= Object.fromEntries( new FormData(data.target));
    if (!dataForm.manejoDatos) {
      setManejoDatos(true)
      return;
    }
    setManejoDatos(false)
    
    if (!verifyEmail(dataForm.email)) {
      return;
    }
    if( !(verifyPassword.minuscula&& 
      verifyPassword.mayuscula&& 
      verifyPassword.numero&& 
      verifyPassword.caracterEspecial && 
      verifyPassword.longitud)) {
        success("faltan requisitos", "warning")
        return;
      }
      
      setLoading(true);
    
        const cognitoStuden = {
          email:dataForm.email,
          password:dataForm.password,
          role:"studen"
        }
        setEmail(dataForm.email);
      /* const student = {
        ...dataForm,
        idTeacher: selectedTeacher.id,
        status: false,
       }*/
       
       try {
      const resCode = await  createStudentCognito(cognitoStuden);
      if(!resCode.success){
         return;
      }
      setReceiveCode(true);
      success("revisa tu correo para confirmar tu registro", "success");
      setLoading(false);
       //const result = await createStudent(student)
      } catch (error) {
        setLoading(false)
        if (error.response.data.message) {

          success(error.response.data.message, "warning");
          setReceiveCode(true);
          return;
        }
       }
      }
      
      // envio de codigo 
     async function sendCode() {

      if (!code) {
        return;
      }
      if (code.length < 6) {
        success("codigo invalido", "warning")
        return;
      }

      const codeUser= {
        email,
        code

      }
      setLoadingSendCode(true)
      try {
        const response = await codeStudentCognito(codeUser);
        if(response.success){
          success(response.message, "success");
          setLoadingSendCode(false);
          setgoHome(true); //provisional
        }else{
          success(response.message, "warning")
        }
      } catch (error) {
        success(error.response.data.message, "warning")
        setLoadingSendCode(false);
      }
     }

     const resendCode = async () => {
     setLoadingNewCode(true);
      try {
        const response = await resendCodeCognito({email:email});
        if (response.success) {
          success(response.message, "success");
     setLoadingNewCode(false);
        }else{
          success(response.message, "warning")
     setLoadingNewCode(false);
        }
      } catch (error) {
        console.log(error.response)

      }
     }
     
   
     const [messageApi, contextHolder] = message.useMessage();
     const success = (message,estado ) => {
       messageApi.open({
         type: estado,
         content: message,
         className: 'text-green',
         style: {
           marginTop: '20vh',
         },
       });
     };
    return (
     <>
       
       { // provisional
        // provisional
        gohome
        ?
        <HomeStudent closeRegisterModal={closeRegisterModal} /> //provisional
        ://provisional
        <>
        {contextHolder}

        <div className=" w-11/12 md:w-3/12 rounded-lg bg-white p-6 shadow-lg font-normal z-40">
        <div className=" w-full grid justify-items-center grid-cols-1 border-b">
          <div className="w-3/12 rounded-md ">
            <img className="rounded-2xl" src={selectedTeacher.profileImageUrl} alt="Teacher" />
          </div>
          <p className="text-sm">Aprende mas con el profesor  {selectedTeacher.firstName}</p>
        </div>
      <form
     onSubmit={(e) => onchangeData(e)}
       className="p-5 text-sm md:text-xs">
               {/* Encabezado de inicio de sesión */}
               <h2 className="text-lg font-bold text-center mb-3">Registrate</h2>

  {/* Botones de inicio de sesión con redes sociales (sin color de fondo) */}
  <div className="mb-6 text-sm">
    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
        <FaGoogle className="mr-2 text-red-500" /> {/* El icono de Google con sus colores */}
        Continuar con Google
    </button>
    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
        <FaFacebook className="mr-2 text-blue-600" /> {/* El icono de Facebook en azul */}
        Continuar con Facebook
    </button>
  </div>
        <div className="mt-2  p-2 border rounded text-sm">

          {!receiveCode?<FormRegister setVerifyPassword={setVerifyPassword} manejoDatos={manejoDatos}/>:<CodeVerify setCode={setCode} />}
        </div>
        
       {
         receiveCode?
         <div className="w-full  p-3 grid justify-items-center grid-cols-1 cursor-pointer gap-4">
          {
          loadingNewCode || loadingSendCode?
          <Spin indicator={<LoadingOutlined spin />} size="large" className="m-auto"/>
          :
          <>
            <button onClick={() => sendCode()} className="w-[130px] h-[35px] p-2 text-center border bg-green-200 cursor-pointer rounded hover:bg-green-500">enviar codigo</button>
            <span onClick={()=> resendCode()} className="underline">optener un nuevo codigo</span>
          </>
          }
        </div>:

        <div className="grid justify-items-center grid-cols-1">
          {
            loading?
            <Spin indicator={<LoadingOutlined spin />} size="large" className="m-auto"/>
            :
          <>
          <div className="w-full flex justify-center m-3 text-xs"
        onClick={() => setInicioSesion(true)}
        >
          <p className="cursor-pointer underline decoration-sky-600 hover:text-blue-500">Inicia sesion</p>
        </div>

        <div className="w-full flex justify-center m-3 text-xs">
           <div
             className="text-center cursor-pointer border w-28 rounded p-1 hover:bg-red-400 mr-20"
             onClick={()=>closeRegisterModal(null)}
            >
             Elegir otro profesor
           </div>
            
               <button
                 className="w-5/12 bg-green-200 border rounded-md hover:bg-green-600"
                 type="submit">
                 Registrarme 
               </button>

        </div>
          </>
            }
        </div>
       }
      </form>  
      </div>
        </>
       }
     </>
    )
}