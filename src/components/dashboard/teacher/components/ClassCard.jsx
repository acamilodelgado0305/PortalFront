import React, { useState } from "react";
import { Card, Modal, Button } from "antd";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";

const ClassCard = ({ classItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const student = classItem.student;

  return (
    <>
      {/* Card para la clase */}
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
                <div className="flex items-center gap-1 font-medium text-[#8bc34a]">
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
              <div className="flex items-center gap-1 font-medium text-[#f44336]">
                Clase finalizada <FcRating className="text-lg" />
              </div>
            )}
          </span>
          {/* <Link
          to={`/clase/${classItem.id}`}
          className="mt-2 text-purple-500 hover:underline"
        >
          Ver detalles
        </Link> */}
          {/* Botón para abrir el modal */}
          <Button
            type="link"
            onClick={handleOpenModal}
            className="mt-2 text-purple-500 hover:underline"
          >
            Ver detalles
          </Button>
        </div>
      </Card>

      {/* Modal con los detalles */}
      <Modal
        title="Detalles de la Clase"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Cerrar
          </Button>,
        ]}
      >
        <p><strong>Estudiante:</strong> {student ? `${student.nombre} ${student.apellido}` : "Desconocido"}</p>
        <p><strong>Fecha:</strong> {classItem.date}</p>
        <p><strong>Hora:</strong> {convertToLocalTime(classItem.hours)}</p>
        <p><strong>Estado:</strong></p>
        <div>
          {!hasClassEnded(classItem) &&
            (classItem.status ? "Aceptado" : "Pendiente de aprobación")}
          {hasClassEnded(classItem) &&
            (classItem.status ? "Clase finalizada" : "Finalizada sin aprobar")}
        </div>
        {/* Puedes agregar más detalles aquí */}
      </Modal>
    </>
  );
};

export default ClassCard;
