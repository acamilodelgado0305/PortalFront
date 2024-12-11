import { useEffect, useState } from "react";
import { Button } from "antd";
import { Card } from "@mui/material";
import { Link } from "react-router-dom";
import { FormRegister } from "./components/formRegister";
import { useAuth } from "../../../Context/AuthContext";
import { getStudentById } from "../../../services/studendent.services";
import { data } from "autoprefixer";
import { Modal, Input, Upload, message } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { FcApproval, FcBusinessContact , FcCancel  } from "react-icons/fc";
import { getClassesByStudentId } from "../../../services/class.services";
import { getUpcomingClasses, getNextClass } from "../../../helpers";

const professors = [
  { id: 1, name: "Dr. Juan Pérez", subject: "Matemáticas" },
  { id: 2, name: "Prof. María Gómez", subject: "Historia" },
  { id: 3, name: "Lic. Laura Martínez", subject: "Lengua y Literatura" },
];

const studentData = {
  userName: "Juan Estudiante",
  email: "juan@correo.com",
  profilePicture:
    "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg", // URL de la foto
};

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("students");
  const [showAll, setShowAll] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [studentRegis, setStudentRegis] = useState("");
  const [classes, setClasses] = useState([]);
  const [userName, setUserName] = useState("");
  const [nextClass, setNextClass] = useState(null)
  const { user, accessToken } = useAuth();

  const getStudent = async () => {
    try {
      const student = await getStudentById(user.id);
      if (student.success) {
        setIsRegister(student.success);
        setStudentRegis(student.data);
      } else {
        setIsRegister(student.success);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data) {
        setIsRegister(error.response.data.success);
        return;
      }
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const result = await getClassesByStudentId(user.id);
        if (result.success) {
          setClasses(result.data);
          setNextClass(getNextClass(result.data))
          console.log("Clases del estudiante " + JSON.stringify(result.data));
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
    getStudent();
  }, []);
  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col bg-gray-50">
      {/* Encabezado */}
      <div className="sticky top-0 w-full bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md">
        <h1 className="text-center text-3xl font-semibold">
          Bienvenido a tu Perfil Estudiantil
        </h1>
      </div>

      <div className="flex-1 space-y-6 p-8">
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
        <div className="text-lg  text-gray-800">
          <h1 className="text-xl text-[#9333ea]">Tu proxima Clase</h1>
          <span>Fecha: {nextClass.date}</span>
        </div>
        <div className="text-lg  text-blue-400">
          Profesor: {nextClass.teacher.firstName}
        </div>
      </div>
    ) : (
      <div className="text-gray-500 text-center">
        No hay clases próximas.
      </div>
    )}
  </div>
        </div>

        {/* Card de Datos del Estudiante */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            Tu Perfil
          </h2>
          <Card className="flex flex-col items-center">
            {/* Imagen de perfil, mostrando la URL de la imagen si está disponible */}
            <div className="mb-4">
              {studentRegis.url ? (
                <img
                  src={studentRegis.url}
                  alt="Perfil"
                  className="h-32 w-32 rounded-full"
                />
              ) : studentData.profilePicture ? (
                <img
                  src={studentData.profilePicture}
                  alt="Perfil"
                  className="h-32 w-32 rounded-full"
                />
              ) : (
                <UserOutlined className="h-32 w-32 text-gray-500" />
              )}
            </div>

            {/* Mostrar el nombre y correo */}
            <div className="text-center">
              <p className="text-lg font-semibold">
                {userName || studentRegis.nombre}
              </p>
              <p className="text-gray-600">
                {user?.email || studentRegis.email}
              </p>
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

        {/* Sección de profesores */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            Tus Clases
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(showAll ? getUpcomingClasses(classes): getUpcomingClasses(classes).slice(0,3)).map((professor) => (
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
                  <span className="text-gray-600">{professor.date}</span>
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
          <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showAll ? 'Ver menos' : 'Ver más'}
        </button>
        </div>

        {/* Sección de actividades */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            Próximas Actividades
          </h2>
          <p className="text-gray-600">
            Aquí aparecerán tus actividades y recordatorios.
          </p>
        </div>
      </div>
      {showModalRegister ? (
        <FormRegister
          getStudent={getStudent}
          setIsRegister={setIsRegister}
          user={user}
          setShowModal={setShowModalRegister}
          showModal={showModalRegister}
        />
      ) : null}
    </div>
  );
};

export default StudentDashboard;
