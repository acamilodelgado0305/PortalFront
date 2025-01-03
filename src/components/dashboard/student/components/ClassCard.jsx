import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";

const ClassCard = ({ professor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { firstName, subjectYouTeach } = professor.teacher;
  const { date, hours, status, meetingId } = professor;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="shadow-md bg-[#fff] transition-all hover:shadow-lg">
        <div className="flex flex-col p-4">
          <span className="text-lg font-semibold">{firstName}</span>
          <span className="text-purple-600">{subjectYouTeach}</span>
          <span className="text-purple-600">{meetingId}</span>
          <span className="text-gray-600">{date} {' '} {convertToLocalTime(hours)}</span>

          <span className="text-gray-600">
            {!hasClassEnded(professor) && (status ? (
              <div className="flex items-center gap-1 font-medium text-[#8bc34a]">
                Aceptado por el profesor <FcApproval className="text-lg" />
              </div>
            ) : (
              <div className="flex items-center gap-1 font-medium text-[#673ab7]">
                Pendiente de aprobación <FcBusinessContact className="text-lg" />
              </div>
            ))}
            {hasClassEnded(professor) && !status && (
              <div className="flex items-center gap-1 font-medium text-[#D50000]">
                Finalizada sin atender <FcCancel className="text-lg" />
              </div>
            )}
            {hasClassEnded(professor) && status && (
              <div className="flex items-center gap-1 font-medium text-[#f44336]">
                Clase finalizada <FcRating className="text-lg" />
              </div>
            )}
          </span>
          <Button
            type="link"
            onClick={handleOpenModal}
            className="mt-2 text-purple-600 hover:underline"
          >
            Ver detalles
          </Button>
        </div>
      </div>

      {/* Modal con detalles */}
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
            <strong>Nombre del Profesor:</strong> {firstName}
          </p>
          <p className="text-lg mb-2">
            <strong>Materia:</strong> {subjectYouTeach}
          </p>
          <p className="text-lg mb-2">
            <strong>Fecha:</strong> {date}
          </p>
          <p className="text-lg mb-2">
            <strong>Hora:</strong> {convertToLocalTime(hours)}
          </p>
          <p className="text-lg mb-4">
            <strong>Estado:</strong>
            <span className="block mt-1 text-base">
              {!hasClassEnded(professor) &&
                (status ? "Aceptado" : "Pendiente de aprobación")}
              {hasClassEnded(professor) &&
                (status ? "Clase finalizada" : "Finalizada sin atender")}
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ClassCard;