import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";
import { UserOutlined } from "@ant-design/icons";
import { FcApproval, FcBusinessContact } from "react-icons/fc";
import { FormRegister } from "./components/formRegister";
import { useAuth } from "../../../Context/AuthContext";
import { getStudentById } from "../../../services/studendent.services";
import { getClassesByStudentId } from "../../../services/class.services";
import { getUpcomingClasses, getNextClass, convertToLocalTime } from "../../../helpers";

import CountdownTimer from "./components/CountdownTimer ";
const defaultProfilePicture = "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg";

const StudentDashboard = () => {
  const [showAll, setShowAll] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [studentRegis, setStudentRegis] = useState(null);
  const [classes, setClasses] = useState([]);
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
        setClasses(activeClasses);
        setNextClass(getNextClass(result.data));
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchClassesData();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col bg-gray-50">
      <div className="sticky top-0 w-full bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
        <h1 className="text-center text-3xl font-semibold">Bienvenido a tu Perfil Estudiantil</h1>
      </div>

      <div className="flex-1 space-y-6 p-8">
        <div className="flex justify-center space-x-4">
          <Link to="/whiteboard/:room">
            <Button className="rounded-lg bg-purple-500 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-700">
              Ir a la Pizarra
            </Button>
          </Link>
        </div>

        <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
          {nextClass ? (
            <div>
              <h1 className="text-xl text-[#9333ea]">Tu próxima Clase</h1>
              <div className="text-lg text-blue-400">Profesor: {nextClass.teacher.firstName}</div>
              <span>Fecha: {nextClass.date} {convertToLocalTime(nextClass.hours)}</span>
        {/*  <CountdownTimer   nextClassId={nextClass.id} classDate={nextClass.date} classTime={nextClass.hours} />  */}  
            </div>
          ) : (
            <div className="text-gray-500 text-center">No hay clases próximas.</div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">Tu Perfil</h2>
          <Card className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src={studentRegis?.url || defaultProfilePicture}
                alt="Perfil"
                className="h-32 w-32 rounded-full"
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{studentRegis?.nombre || user.name}</p>
              <p className="text-gray-600">{studentRegis?.email || user.email}</p>
            </div>
          </Card>
          {!isRegister && (
            <Button
              onClick={() => setShowModalRegister(true)}
              className="ml-9 rounded-lg bg-purple-500 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-600"
            >
              Continuar con el registro
            </Button>
          )}
        </div>

        {/* Classes Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">Tus Clases</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(showAll ? classes : classes.slice(0, 3)).map((professor) => (
              <Card key={professor.teacher.id} className="shadow-md transition-all hover:shadow-lg">
                <div className="flex flex-col p-4">
                  <span className="text-lg font-semibold">{professor.teacher.firstName}</span>
                  <span className="text-gray-600">{professor.teacher.subjectYouTeach}</span>
                  <span className="text-gray-600">{professor.date} {convertToLocalTime(professor.hours)}</span>
                  <span className="text-gray-600">
                    {professor.status ? (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        Aceptada por el profesor <FcApproval className="text-lg" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#673ab7] font-medium">
                        Pendiente <FcBusinessContact className="text-lg" />
                      </div>
                    )}
                  </span>
                  <Link to={`/profesor/${professor.id}`} className="mt-2 text-blue-500 hover:underline">
                    Ver detalles
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          {classes.length > 3 && (
            <button onClick={() => setShowAll(!showAll)} className="mt-4 text-blue-500 hover:underline">
              {showAll ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>

        {/* Upcoming Activities */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">Próximas Actividades</h2>
          <p className="text-gray-600">Aquí aparecerán tus actividades y recordatorios.</p>
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
