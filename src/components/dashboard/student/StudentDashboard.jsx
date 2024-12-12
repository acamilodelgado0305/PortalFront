import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";
import { UserOutlined } from "@ant-design/icons";
import { FcApproval, FcBusinessContact, FcCancel, FcRating   } from "react-icons/fc";
import { FormRegister } from "./components/formRegister";
import { useAuth } from "../../../Context/AuthContext";
import { getStudentById } from "../../../services/studendent.services";
import { getClassesByStudentId } from "../../../services/class.services";
import {
  getUpcomingClasses,
  getNextClass,
  convertToLocalTime,
  getActiveClasses,
  sortClassesByDate,
  hasClassEnded,
} from "../../../helpers";

import CountdownTimer from "./components/CountdownTimer ";
const defaultProfilePicture =
  "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [showAllOldClasses, setShowAllOldClasses] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [studentRegis, setStudentRegis] = useState(null);
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [allClasses, setAllClasses] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const { user } = useAuth();

  const fetchStudentData = async () => {
    try {
      const student = await getStudentById(user.id);
      setIsRegister(student.success);
      if (student.success) setStudentRegis(student.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setIsRegister(false);
    }
  };

  const fetchClassesData = async () => {
    try {
      const result = await getClassesByStudentId(user.id);
      if (result.success) {
        const activeClasses = getUpcomingClasses(result.data);
        setAllClasses(result.data);
        setClasses(activeClasses);
        setNextClass(getNextClass(result.data));
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const handleGoToWhiteboard = (nextClassId) => {
    navigate("/whiteboard/" + nextClassId);
  };
  useEffect(() => {
    fetchStudentData();
    fetchClassesData();
  }, []);

  useEffect(() => {
    if (allClasses) {
      let data = getActiveClasses(allClasses);
      data = sortClassesByDate(data);
      setActiveClass(data);
      console.log("Clase activa " + JSON.stringify(data));
    }
  }, [allClasses?.length]);

  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col bg-gray-50">
      <div className="sticky top-0 w-full bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
        <h1 className="text-center text-3xl font-semibold">
          Bienvenido a tu Perfil Estudiantil
        </h1>
      </div>
      <div className="rounded-lg  p-6 ">
        <h2 className="mb-4 text-xl font-semibold text-blue-600">Tu Perfil</h2>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img
              src={studentRegis?.url || defaultProfilePicture}
              alt="Perfil"
              className="h-32 w-32 rounded-full"
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {studentRegis?.nombre || user.name}
            </p>
            <p className="text-gray-600">{studentRegis?.email || user.email}</p>
          </div>
        </div>
        {!isRegister && (
          <Button
            onClick={() => setShowModalRegister(true)}
            className="ml-9 rounded-lg bg-purple-500 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-600"
          >
            Continuar con el registro
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-6 p-8">
        {/*
        <div className="flex justify-center space-x-4">
          <Link to="/whiteboard/:room">
            <Button className="rounded-lg bg-purple-500 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-700">
              Ir a la Pizarra
            </Button>
          </Link>
        </div> */}

        <div className="flex">
          <div className="mx-auto max-w-sm space-y-4 rounded-xl  p-4 ">
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
          <div className="mx-auto max-w-sm space-y-4 rounded-xl  p-4 ">
            {activeClass?.length > 0 ? (
              <>
                <div>
                  <h1 className="text-xl text-[#9333ea]">Clase Activa</h1>
                  <div className="text-lg text-blue-400">
                    Profesor: {activeClass[0]?.teacher?.firstName}
                  </div>
                  <span>
                    Fecha: {activeClass?.date} Inició{" "}
                    {convertToLocalTime(activeClass[0]?.hours)}
                  </span>
                </div>{" "}
                <button
                  onClick={() => handleGoToWhiteboard(activeClass[0]?.id)}
                  className="mt-1 rounded-lg bg-purple-500 px-6 py-1 text-white shadow-md transition-all hover:bg-purple-700"
                >
                  Ir a la Pizarra
                </button>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                No hay clases Activas.
              </div>
            </div>
            
            )}
          </div>
        </div>

        {/* Classes Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            Próximas Actividades
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(showAll ? classes : classes.slice(0, 3)).map((professor) => (
              <Card
                key={professor.teacher.id}
                className="shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex flex-col p-4">
                  <span className="text-lg font-semibold">
                    {professor.teacher.firstName}
                  </span>
                  <span className="text-gray-600">
                    {professor.teacher.subjectYouTeach}
                  </span>
                  <span className="text-gray-600">
                    {professor.date} {convertToLocalTime(professor.hours)}
                  </span>
                  <span className="text-gray-600">
                    {professor.status ? (
                      <div className="flex items-center gap-1 font-medium text-green-600">
                        Aceptada por el profesor{" "}
                        <FcApproval className="text-lg" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 font-medium text-[#673ab7]">
                        Pendiente <FcBusinessContact className="text-lg" />
                      </div>
                    )}
                  </span>

                  <Link
                    to={`/profesor/${professor.id}`}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    Ver detalles
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          {classes.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-blue-500 hover:underline"
            >
              {showAll ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            Todas tus clases
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(showAllOldClasses
              ? allClasses
              : (allClasses || []).slice(0, 3)
            ).map((professor) => (
              <Card
                key={professor.teacher.id}
                className="shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex flex-col p-4">
                  <span className="text-lg font-semibold">
                    {professor.teacher.firstName}
                  </span>
                  <span className="text-gray-600">
                    {professor.teacher.subjectYouTeach}
                  </span>
                  <span className="text-gray-600">
                    {professor.date} {convertToLocalTime(professor.hours)}
                  </span>
                  <span className="text-gray-600">
                    {!hasClassEnded(professor) && (professor.status ? (
                      <div className="flex items-center gap-1 font-medium text-green-600">
                        Aceptada por el profesor{" "}
                        <FcApproval className="text-lg" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 font-medium text-[#673ab7]">
                        Pendiente aceptación<FcBusinessContact className="text-lg" />
                      </div>
                    ))}
                   {hasClassEnded(professor) && !professor.status && 
                    <div className="flex items-center gap-1 font-medium text-[#D50000]">
                     Finalizó sin realizarse <FcCancel  className="text-lg" />
                  </div>
                   }
                         {hasClassEnded(professor) && professor.status && 
                    <div className="flex items-center gap-1 font-medium text-[#D50000]">
                       Clase terminada <FcRating   className="text-lg" />
                  </div>
                   }

                  </span>


                  {/*
                   <span className="text-gray-600">
  {hasClassEnded(professor) ? 'Clase terminada' : 'Clase activa'}
</span>
          
          */}

                  <Link
                    to={`/profesor/${professor.id}`}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    Ver detalles
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          {allClasses && allClasses.length > 3 && (
            <button
              onClick={() => setShowAllOldClasses(!showAllOldClasses)}
              className="mt-4 text-blue-500 hover:underline"
            >
              {showAllOldClasses ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>

      {showModalRegister && (
        <FormRegister
          getStudent={fetchStudentData}
          setIsRegister={setIsRegister}
          user={user}
          setShowModal={setShowModalRegister}
          showModal={showModalRegister}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
