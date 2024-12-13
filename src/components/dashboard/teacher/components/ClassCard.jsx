// ReusableCard.jsx
import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";

const ClassCard = ({ classItem }) => {
  const student = classItem.student;
  console.log('entre')

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <div className="flex flex-col p-4">
        <span className="text-lg font-semibold">
          {student ? `${student.nombre} ${student.apellido}` : "Estudiante desconocido"}
        </span>
        <span className="text-gray-600">
          Fecha: {classItem.date} {convertToLocalTime(classItem.hours)}
        </span>
        <span className="text-gray-600">
          {!hasClassEnded(classItem) &&
            (classItem.status ? (
              <div className="flex items-center gap-1 font-medium text-green-600">
                Aceptado por usted <FcApproval className="text-lg" />
              </div>
            ) : (
              <div className="flex items-center gap-1 font-medium text-[#673ab7]">
                Pendiente de aprobación <FcBusinessContact className="text-lg" />
              </div>
            ))}
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
};

export default ClassCard;
