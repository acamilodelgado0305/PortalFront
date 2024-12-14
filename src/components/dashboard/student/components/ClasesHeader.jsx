import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FaCalendarTimes, FaChalkboardTeacher } from "react-icons/fa";
import CountdownTimer from "../../CountdownTimer";
import { convertToLocalTime } from "../../../../helpers";

const ClasesHeader = ({
  studentRegis,
  defaultProfilePicture,
  nextClass,
  activeClass,
  isRegister,
  setShowModalRegister,
}) => {
  const navigate = useNavigate();
  const handleGoToWhiteboard = (nextClassId) => {
    navigate("/whiteboard/" + nextClassId);
  };
  return (
    <>  
    <div className="m-4">
    <h2 className="text-[30px] font-semibold text-[#9638eb]">
        Tu Perfil
      </h2>
      <h4 className="text-[17px] text-[#9638eb]">
        Gestión de clases
      </h4>
      
      </div>
    <div className="mb-6 flex justify-between items-center md:px-4">     
   
  <div className="rounded-lg p-6 "> 

    <div className="flex flex-col items-center">
   
      <div className="mb-4">
        <img
          src={studentRegis?.url || defaultProfilePicture}
          alt="Perfil"
          className="h-[11rem] w-[11rem] rounded-full"
        />
      </div>
      <div className="text-center">
        <p className="text-[1.5rem] font-semibold text-[#9638eb]">
          {studentRegis?.nombre || "Usuario"}
        </p>
        <p className="text-purple-600">{studentRegis?.email || "Correo"}</p>
          <button
                onClick={()=>handleGoToWhiteboard(studentRegis.id)}
                className="rounded-lg bg-purple-500 px-6 py-1 text-white items-center justify-center shadow-md transition-all hover:bg-purple-700 mt-1 flex gap-3"
              >
               Pizarra de Prueba <FaChalkboardTeacher/>
              </button>
      </div>

    </div>
    {!isRegister && (
      <div className="mt-6">
        <Button
          onClick={() => setShowModalRegister(true)}
          className="rounded-lg bg-purple-500 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-600"
        >
          Continuar con el registro
        </Button>
      </div>
    )}
  </div>


      {/* Próxima Clase */}
      <div className="mx-4 max-w-sm rounded-xl p-4">
        {nextClass ? (
          <div>
            <h1 className="text-xl text-[#9333ea]">Tu próxima Clase</h1>
            <div className="text-lg text-purple-600">
              Profesor: {nextClass.teacher.firstName}
            </div>
            <span>
              Fecha: {nextClass.date} {convertToLocalTime(nextClass.hours)}
            </span>
            <CountdownTimer
              nextClassId={nextClass.id}
              classDate={nextClass.hours}
            />
          </div>
        ) : (
          <>
           <h1 className="text-xl text-[#9333ea]">Tu próxima Clase</h1>
            <div className="flex gap-1 items-center justify-center py-3 px-4 rounded-md bg-[#fff] h-[100px]  text-[#9638eb]">
                  <FaCalendarTimes/>  No hay proximas clases  
               </div></>
        )}
      </div>

      {/* Clase Activa */}
      <div className="mx-6 max-w-sm rounded-xl p-4"> 
        <h1 className="text-xl text-[#9333ea]">Clase Activa</h1>
        {activeClass?.length > 0 ? (
          <>
            <div>
              <div className="text-lg text-[#9333ea]">
                Profesor: {activeClass[0]?.teacher?.firstName}
              </div>

              <span>
              Fecha: {activeClass[0].date} {convertToLocalTime(activeClass[0].hours)}
            </span>
              <div className="text-center py-3 px-6 rounded-md bg-[#9333ea66] shadow-lg mt-3">
              <h3 className={`text-lg font-semibold text-[#a14eec]`}>¡La clase ya inició, ingresa aquí!</h3>
              <span  className={`text-lg text-[#a14eec]`}>
                Fecha: {activeClass?.date} Inició{" "}
                {convertToLocalTime(activeClass[0]?.hours)}
              </span>
         <button
              onClick={()=>handleGoToWhiteboard(activeClass.id)}
              className="rounded-lg bg-purple-500 px-6 py-1 text-white items-center justify-center shadow-md transition-all hover:bg-purple-700 mt-1 flex gap-3"
            >
              Ir a la Pizarra <FaChalkboardTeacher/>
            </button>
            </div>
</div>


          </>
        ) : (
          <div className="flex gap-1 items-center justify-center py-3 px-4 rounded-md bg-[#fff] h-[100px]  text-[#9638eb]">
             <FaCalendarTimes/>  No hay clase en este momento 
          </div>
        )}
      </div>
    </div></>
  );
};

export default ClasesHeader;
