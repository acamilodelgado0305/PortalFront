import React from "react";
import { Button } from "antd";
import CountdownTimer from "./CountdownTimer";
import { convertToLocalTime } from "../../../../helpers";

const ClasesHeader = ({
  studentRegis,
  defaultProfilePicture,
  nextClass,
  activeClass,
  isRegister,
  setShowModalRegister,
  handleGoToWhiteboard,
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
  <div className="rounded-lg p-6 ">
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-[30px] font-semibold text-[#9638eb]">
        Tu Perfil
      </h2>
      <div className="mb-4">
        <img
          src={studentRegis?.url || defaultProfilePicture}
          alt="Perfil"
          className="h-32 w-32 rounded-full"
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold">
          {studentRegis?.nombre || "Usuario"}
        </p>
        <p className="text-gray-600">{studentRegis?.email || "Correo"}</p>
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
            <div className="text-lg text-blue-400">
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
                Profesor: {activeClass[0]?.teacher?.firstName}
              </div>
              <span>
                Fecha: {activeClass?.date} Inició{" "}
                {convertToLocalTime(activeClass[0]?.hours)}
              </span>
            </div>
            <button
              onClick={() => handleGoToWhiteboard(activeClass[0]?.id)}
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
    </div>
  );
};

export default ClasesHeader;
