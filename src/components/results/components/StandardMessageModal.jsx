import { useState } from "react";

function StandardMessageModal({ isOpen, onClose, teacher }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(`Mensaje para ${teacher.name}: ${message}`);
    // Lógica para enviar el mensaje
    onClose(); // Cerrar el modal después de enviar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Icono de cruz para cerrar el modal */}
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
          className="h-30 w-30 mx-auto rounded-full object-cover lg:h-[11em] lg:w-[11em]"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/128x128";
          }}
        />

        <h2 className="mb-4 text-xl font-semibold text-center pt-5">
          Enviar mensaje a {teacher.firstName} {teacher.lastName}
        </h2>
        <h3 className="mb-4 text-[18px] py-5  text-gray text-center"> Habla con el profesor sobre tus necesidades de aprendizaje, tus inquietudes y consultas
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
            className="w-full rounded-md border-[3.5px] border-black bg-[#FF7AAC] px-4 py-2 font-semibold text-black hover:bg-[#D4658F]"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default StandardMessageModal;
