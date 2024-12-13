import React from "react";
import { Button } from "antd";
import CountdownTimer from "../../student/components/CountdownTimer";
import { convertToLocalTime } from "../../../../helpers";
const defaultProfilePicture =
  "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg";
const ClassesHeader = ({ teacher, nextClass, activeClass }) => {
  console.log(JSON.stringify(teacher))
  return (

    <div> <h2 className="m-4 text-[30px] font-semibold text-[#9638eb]">
        Tu Perfil
      </h2>
    <div className="mb-6 flex justify-between items-center md:px-4">
  <div className="rounded-lg p-6 "> 
     
    <div className="flex flex-col items-center">
   
      <div className="mb-4">
        <img
          src={teacher?.profileImageUrl || defaultProfilePicture}
          alt="Perfil"
          className="h-[11rem] w-[11rem] rounded-full"
        />
      </div>
      <div className="text-center">
        <p className="text-[1.5rem] font-semibold  text-[#9638eb]">
          {teacher?.firstName  || "Usuario"} {teacher?.lastName}
        </p>
        <p className="text-purple-600">{teacher?.email || "Correo"}</p>
      </div>
    </div>
    
  </div>


      {/* Próxima Clase */}
      <div className="mx-4 max-w-sm rounded-xl p-4">
        {nextClass ? (
          <div>
            <h1 className="text-xl text-[#9333ea]">Tu próxima Clase</h1>
            <div className="text-lg text-purple-600">
              Estudiante: {nextClass.student.nombre}
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
          <div className="text-center text-gray-500">
            No hay clases próximas.
          </div>
        )}
      </div>

      {/* Clase Activa */}
      <div className="mx-6 max-w-sm rounded-xl p-4"> 
        <h1 className="text-xl text-[#9333ea]">Clase Activa</h1>
        {activeClass?.length > 0 ? (
          <>
            <div>
              <div className="text-lg text-blue-400">
                Estudiante: {activeClass[0]?.student?.firstName}
              </div>
              <span>
                Fecha: {activeClass?.date} Inició{" "}
                {convertToLocalTime(activeClass[0]?.hours)}
              </span>
            </div>
            <button
              className="mt-1 rounded-lg bg-purple-500 px-6 py-1 text-white shadow-md transition-all hover:bg-purple-700"
            >
              Ir a la Pizarra
            </button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              No hay clase en este momento
            </div>
          </div>
        )}
      </div>
    </div></div>
  );
};

export default ClassesHeader;
