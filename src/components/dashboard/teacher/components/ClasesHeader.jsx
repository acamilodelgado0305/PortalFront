import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";

const ClasesHeader = ({ classes, onClassClick }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-purple-600">Tus Clases</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => {
          const student = classItem.student;
          return (
            <Card
              key={classItem.id}
              className="shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex flex-col p-4">
                <span className="text-lg font-semibold">
                  {student
                    ? `${student.nombre} ${student.apellido}`
                    : "Estudiante desconocido"}
                </span>
                <span className="text-gray-600">
                  Estado: {classItem.status ? "Aprobado" : "Pendiente"}
                </span>
                <span className="text-gray-600">
                  Fecha:{classItem.date} {convertToLocalTime(classItem.hours)}
                </span>
                <span className="text-gray-600">
                  {!hasClassEnded(classItem) &&
                         <div className="flex items-center gap-1 font-medium text-green-600">
                          Clase pendiente
                         <FcApproval className="text-lg" />
                       </div>}
                  {hasClassEnded(classItem) && !classItem.status && (
                    <div className="flex items-center gap-1 font-medium text-[#D50000]">
                      Finalizada sin aprobar <FcCancel className="text-lg" />
                    </div>
                  )}
                  {hasClassEnded(classItem) && classItem.status && (
                    <div className="flex items-center gap-1 font-medium text-[#D50000]">
                      Clase finalizada <FcRating className="text-lg" />
                    </div>
                  )}
                </span>
                <Link
                  to={`/clase/${classItem.id}`}
                  className="mt-2 text-purple-500 hover:underline"
                >
                  Ver detalles
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClasesHeader;
