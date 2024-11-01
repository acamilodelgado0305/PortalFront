import { useState } from "react";
import Login from "../auth/Login";
import Register from "../auth/RegisterPage";

function ModalRegister({ selectedTeacher, closeRegisterModal }) {
  const [inicioSesion, setInicioSesion] = useState(false);

  // Función para renderizar el contenido dinámico (Login o Register)
  function renderContent() {
    if (inicioSesion) {
      return <Login closeRegisterModal={closeRegisterModal} setInicioSesion={setInicioSesion} />;
    } else {
      return <Register selectedTeacher={selectedTeacher} closeRegisterModal={closeRegisterModal} setInicioSesion={setInicioSesion} />;
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-3">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={closeRegisterModal} className="absolute top-3 right-3 text-gray-500">X</button>

        {/* Encabezado con información del profesor */}
        <div className="w-full flex flex-col items-center border-b pb-4 mb-4">
          <img className="w-20 h-20 rounded-full" src={selectedTeacher.profileImageUrl} alt="Teacher" />
          <p className="text-lg font-semibold mt-2">Aprende más con {selectedTeacher.firstName}</p>
        </div>

        {/* Renderizado de Login o Register según el estado */}
        <div className="max-h-[80vh] overflow-y-auto">
          {renderContent()}
        </div>

        {/* Enlace para alternar entre Login y Register */}
        <div className="flex justify-center mt-4">
          {inicioSesion ? (
            <p className="text-center">
              ¿No tienes cuenta?{" "}
              <span onClick={() => setInicioSesion(false)} className="text-blue-500 underline cursor-pointer">
                Regístrate
              </span>
            </p>
          ) : (
            <p className="text-center">
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setInicioSesion(true)} className="text-blue-500 underline cursor-pointer">
                Inicia sesión
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalRegister;
