import { useEffect, useState } from "react";

import ClasesHeader from "./components/ClasesHeader";
import UpcomingClasses from "./components/UpcomingClasses";
import AllClasses from "./components/AllClasses";
import FormRegister from "../../dashboard/student/components/FormRegister";
import { useAuth } from "../../../Context/AuthContext";
import { getStudentById } from "../../../services/studendent.services";
import { getClassesByStudentId } from "../../../services/class.services";
import { getUpcomingClasses, getNextClass, getActiveClasses } from "../../../helpers";

const defaultProfilePicture =
  "https://res.cloudinary.com/dybws2ubw/image/upload/v1725210316/avatar-image_jouu10.jpg";

const StudentDashboard = () => {

  const [showAllOldClasses, setShowAllOldClasses] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [studentRegis, setStudentRegis] = useState(null);
  const [classes, setClasses] = useState([]);
  const [allClasses, setAllClasses] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [activeClass, setActiveClass] = useState(null);
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
        const comingClasses = getUpcomingClasses(result.data);
        setClasses(comingClasses);
        setActiveClass(getActiveClasses(result.data));
        setAllClasses(result.data);
        setNextClass(getNextClass(result.data));
      }
    } catch (error) {
      console.error("Error fetching clas(ses:", error);
    }
  };



  useEffect(() => {
    fetchStudentData();
    fetchClassesData();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col bg-gray-50">
      <div className="sticky top-0 w-full bg-gradient-to-r from-purple-400 to-purple-600 p-6 text-white shadow-md z-[9]">
        <h1 className="text-center text-3xl font-semibold">
          Bienvenido a tu Perfil Estudiantil
        </h1>
      </div>
      <ClasesHeader
        studentRegis={studentRegis}
        defaultProfilePicture={defaultProfilePicture}
        nextClass={nextClass}
        isRegister={isRegister}
        setShowModalRegister={setShowModalRegister}
        activeClass={activeClass}
      />
      <div className="flex-1 space-y-4 p-4 pb-8">
        <UpcomingClasses classes={classes} />
        <AllClasses
          allClasses={allClasses}
          showAllOldClasses={showAllOldClasses}
          setShowAllOldClasses={setShowAllOldClasses}
        />
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
