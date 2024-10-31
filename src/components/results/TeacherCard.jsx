import React, { useState } from "react";
import { getFlagUrl } from "../../services/allcountries.js";
import { Play, X } from "lucide-react";
import { ScheduleModal } from "./components/ScheduleModal.jsx";

const TeacherCard = ({ teacher, onVideoClick }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price * 1000);
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="group relative">
      <div className="h-[auto] w-[50%] rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-black hover:shadow-md lg:h-[37vh] lg:w-[100%]">
        <div className="flex gap-6">
          <div >
            <img
              src={teacher.profileImageUrl}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="h-20 w-20 rounded-lg object-cover lg:h-32 lg:w-32"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/128x128";
              }}
            />
          </div>

          <div className="w-[50%] flex-1 lg:w-[100%]">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div className="flex items-center">
                    <img
                      src={getFlagUrl(teacher.countryOfBirth)}
                      style={{ width: "20px", heigth: "20px" }}
                      className="mx-2"
                    />
                    <span className="text-yellow-400">★</span>

                    <span className="font-medium">{teacher.rating || 5}</span>
                    <span className="ml-1 hidden text-sm text-gray-600 md:block">
                      ({teacher.reviews || 3} opiniones)
                    </span>
                  </div>
                </div>

                <p className="mb-1 text-gray-600 pb-4 lg:pb-0">{teacher.subjectYouTeach}</p>

                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 ">
                  <div className="flex items-center absolute lg:static">
                    <span>
                      {teacher.activeStudents || 3} estudiantes activos
                    </span>
                    <span className="mx-2">•</span>
                    <span>{teacher.lessonsGiven || 162} lecciones</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Habla {teacher.language} (
                    {teacher.languageLevel === "native" ? "Nativo" : "Avanzado"}
                    )
                  </span>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="text-xl font-semibold text-gray-900">
                  {formatPrice(teacher.hourlyRate)}
                </p>
                <p className="text-sm text-gray-500">Lección de 50 minutos</p>
              </div>
            </div>
            <div className="w-[50%] py-3 text-gray-700 lg:absolute lg:py-0">
              {teacher.description?.introduction}
            </div>
            <div className="flex w-[100%] flex-col gap-3 text-right lg:items-end lg:justify-end">
              <button
                onClick={() => console.log("Clase de prueba gratuita")}
                className="w-[12em] rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-purple-600"
              >
                Clase de prueba gratuita
              </button>

              <button
                onClick={() => console.log("Enviar mensaje")}
                className="w-[12em] rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[30%] top-0 z-10 ml-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:left-full">
        <div className="h-[17em] h-[auto] w-[27em] rounded-lg border !border-black border-black bg-white p-3 shadow-lg lg:h-[auto]">
          <div
            className={`relative h-[15em] w-full rounded-lg bg-gray-100 ${teacher.video ? "cursor-pointer" : ""} overflow-hidden`}
            onClick={() => teacher.video && onVideoClick(teacher.video)}
          >
            {teacher.video ? (
              <>
                <img
                  src={getYouTubeThumbnail(teacher.video)}
                  alt="Vista previa del video"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-200 hover:bg-opacity-40">
                  <Play
                    size={48}
                    className="text-white opacity-80 transition-opacity duration-200 hover:opacity-100"
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                <Play size={48} className="mb-2 opacity-50" />
                <span className="text-sm">Video no disponible</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScheduleModal(true);
              }}
              className="mt-3 w-[12em] rounded bg-purple-500 px-4 py-2 text-center text-sm font-medium text-white hover:text-gray-900"
            >
              Ver horario completo
            </button>
          </div>
        </div>
      </div>

      {/* Modal del horario */}
      {showScheduleModal && (
        <ScheduleModal
          availability={teacher.Availability}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherCard;
