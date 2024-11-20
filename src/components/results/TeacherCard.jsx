import React, { useState } from "react";
import { getFlagUrl } from "../../services/allcountries.js";
import { Play, Send } from "lucide-react";
import { ScheduleModal } from "./components/ScheduleModal.jsx";
import ModalRegister from "./modalRegister.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import { SendOutlined } from "@ant-design/icons";
import StandardMessageModal from "./components/StandardMessageModal.jsx";
import IconoMensaje from '../../assets/icons/send.svg';


const TeacherCard = ({ teacher, onVideoClick, setShowCalendarModal, setSelectedTeacher }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const { idToken, user } = useAuth();



  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };


  const getYouTubeThumbnail = (url) => {
    const videoId = url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="group relative">
      <div className="h-[auto] w-[50%]  border border-gray-300 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-600 border-2 hover:shadow-md lg:h-[37vh] lg:w-[100%]">
        <div className="flex gap-6">
          <div>
            <img
              src={teacher.profileImageUrl}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="h-30 w-30 rounded-lg object-cover lg:h-ful lg:w-[11em] lg:h-[11em]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/128x128";
              }}
            />
          </div>

          <div className="w-[50%] flex-1 lg:w-[100%]">
            <div className="flex items-start justify-between">
              <div className="w-[34]">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-3xl font-medium text-bold">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div className="flex items-center">
                    <img
                      src={getFlagUrl(teacher.countryOfBirth)}
                      style={{ width: "25px", height: "15px" }}
                      className="mx-2"
                    />
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{teacher.rating || 5}</span>
                    <span className="ml-1 hidden text-sm text-gray-600 md:block">
                      ({teacher.reviews || 3} opiniones)
                    </span>
                  </div>
                </div>


                <p className="mb-1 text-2xl text-black pb-4 lg:pb-0">
                  Enseña: {teacher.subjectYouTeach}

                </p>
                <div className="w-[34em]">
                  <p className="mb-1 text-2xl text-black pb-4 lg:pb-0 ">

                    {teacher.description?.introduction}
                  </p>

                </div>


                {/*------------------------*/}


                <div className="mb-3 flex items-start gap-2 text-2xl text-gray-600">
                  <div className="flex flex-col items-start">
                    <span className="block">{teacher.activeStudents || 3} estudiantes activos</span>
                    <span className="block">{teacher.lessonsGiven || 162} lecciones</span>
                    <span className="block">
                      Habla {teacher.language} ({teacher.languageLevel === "native" ? "Nativo" : "Avanzado"})
                    </span>
                  </div>
                </div>


              </div>

              <div className="lg:text-right">
                <p className="font-semibold text-3xl">
                  US {formatPrice(teacher.hourlyRate)}
                </p>

              </div>
            </div>

            <div className="flex w-[100%] flex-col gap-3 text-right lg:items-end lg:justify-end mt-[-6em]">
              <button
                onClick={() => { !idToken ? setShowRegisterModal(true) : setShowCalendarModal(true), setSelectedTeacher(teacher) }}
                className="w-[12em] bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
              >
                Reservar una clase de prueba
              </button>
              <button
                onClick={() => {
                  !idToken ? setShowRegisterModal(true) : setShowSendMessageModal(true);
                }}
                className="w-[12em] flex items-center gap-2 border border-purple-600 text-gray-700 py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <img
                  src={IconoMensaje}
                  alt="Enviar mensaje"
                  className="h-10 w-10"
                />
                <span>Enviar mensaje</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[30%] top-0 z-10 ml-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:left-full">
        <div className="h-[21.8em] w-[27em]  border !border-purple-600 border-2 border-black bg-white p-3 shadow-lg ">
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

      {/* Modal de registro */}
      {showRegisterModal && (
        <ModalRegister
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showSendMessageModal && (
        <StandardMessageModal
          isOpen={showSendMessageModal}
          onClose={() => { setShowSendMessageModal(false) }}
          teacher={teacher}
          user={user}
        />
      )}
    </div>
  );
};

export default TeacherCard;
