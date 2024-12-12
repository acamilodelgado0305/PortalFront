import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClasesHeader from "./components/ClasesHeader";
import UpcomingClasses from "./components/UpcomingClasses";
import AllClasses from "./components/AllClasses";
import { FormRegister } from "./components/FormRegister";
import { useAuth } from "../../../Context/AuthContext";
import { getStudentById,  getClassesByStudentId } from "../../../services/studendent.services";
import { getUpcomingClasses, getNextClass } from "../../../helpers";

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
        setClasses(getUpcomingClasses(result.data));
        setAllClasses(result.data);
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

  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col bg-gray-50">
      <ClasesHeader
        studentRegis={studentRegis}
        defaultProfilePicture={defaultProfilePicture}
        nextClass={nextClass}
        isRegister={isRegister}
        setShowModalRegister={setShowModalRegister}
        handleGoToWhiteboard={handleGoToWhiteboard}
      />
      <div className="flex-1 space-y-4 p-4 pb-8">
        <UpcomingClasses classes={classes} showAll={showAll} setShowAll={setShowAll} />
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
