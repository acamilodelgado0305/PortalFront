import { useState } from "react";
import { createStandardMessage } from "../../../services/standardMessages.services";
import Swal from "sweetalert2";

function SendStandardMessage({ isOpen, onClose, teacher, user }) {
  const [message, setMessage] = useState("");
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const teacherId = teacher.cognitoId ? teacher.cognitoId : teacher.id;

    const data = {
      userId: user.id,
      touserId: teacherId,
      message,
    };

    try {
      const response = await createStandardMessage(data);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Mensaje enviado",
          text: "Tu mensaje fue enviado exitosamente.",
          confirmButtonColor: "#FF7AAC",
        });
        setMessage("");
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al enviar el mensaje. Intenta nuevamente.",
          confirmButtonColor: "#FF7AAC",
        });
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
        confirmButtonColor: "#FF7AAC",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={teacher.profileImageUrl}
          alt={`${teacher.firstName} ${teacher.lastName}`}
          className="h-20 w-20 mx-auto rounded-full object-cover lg:h-[11em] lg:w-[11em]"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/128x128";
          }}
        />

        <h2 className="mb-4 text-xl font-semibold text-center pt-5">
          Enviar mensaje a {teacher.firstName} {teacher.lastName}
        </h2>
        <h3 className="mb-4 text-[18px] py-5 text-gray text-center">
          Habla con el profesor sobre tus necesidades de aprendizaje, tus inquietudes y consultas
        </h3>

        <form onSubmit={handleSendMessage}>
          <textarea
            className="mb-4 h-32 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-md border-[3.5px] border-black bg-[#a855f7] px-4 py-2 font-semibold text-black hover:bg-[#6A369C]"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendStandardMessage;
