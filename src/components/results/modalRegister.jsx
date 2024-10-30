import { useState } from "react";
import { Register } from "../auth/register";
import Login from "../auth/Login";

function ModalRegister({ selectedTeacher, closeRegisterModal }) {
  const [inicioSesion, setInicioSesion] =useState(false)

  return (
    <div 
    className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-3 scroll-auto">
      {
      inicioSesion
      ? <Login setInicioSesion={setInicioSesion} />
      :<Register setInicioSesion={setInicioSesion} selectedTeacher={selectedTeacher} closeRegisterModal={closeRegisterModal} />
    
    }     
    </div>
  );
}

export default ModalRegister;
