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
        title={
          <h2 className="text-2xl font-bold text-purple-600">Detalles de la Clase</h2>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseModal}
            className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-lg"
          >
            Cerrar
          </Button>,
        ]}
        bodyStyle={{
          backgroundColor: "#f9f9f9",
          padding: "24px",
          borderRadius: "10px",
        }}
        style={{
          maxWidth: "800px",
          top: 50,
          fontSize: "16px",
        }}
      >
        <div className="text-gray-700">
          <p className="text-lg mb-2">
            <strong>Estudiante:</strong> {student ? `${student.nombre} ${student.apellido}` : "Desconocido"}
          </p>
          <p className="text-lg mb-2">
            <strong>Fecha:</strong> {classItem.date}
          </p>
          <p className="text-lg mb-2">
            <strong>Hora:</strong> {convertToLocalTime(classItem.hours)}
          </p>
          <p className="text-lg mb-4">
            <strong>Estado:</strong>
            <span className="block mt-1 text-base">
              {!hasClassEnded(classItem) &&
                (classItem.status ? "Aceptado" : "Pendiente de aprobación")}
              {hasClassEnded(classItem) &&
                (classItem.status ? "Clase finalizada" : "Finalizada sin aprobar")}
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ClassCard;
