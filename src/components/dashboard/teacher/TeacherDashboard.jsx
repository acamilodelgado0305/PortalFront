import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { getClassesByTeacherId, updateClassById } from "../../../services/class.services.js";
import { getUpcomingClasses, getNextClass, getActiveClasses, sortClassesByDate } from "../../../helpers";
import { useAuth } from '../../../Context/AuthContext.jsx';
import StudentLastMessages from './components/StudentLastMessages.jsx';
import AllClasses from './components/AllClasses.jsx'; 
import ClassesHeader from './components/ClassesHeader.jsx'
import ClassesToApprove from './components/ClassesToApprove.jsx'; 
import { getTeacherById } from '../../../services/teacher.services.js';
import UpcomingClasses from './components/UpcomingClasses.jsx';


const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('teachers');
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([])
  const [nextClass, setNextClass]=useState(null);
  const [activeClass, setActiveClass] = useState(null);
  const [teacherRegis, setTeacherRegis] = useState(null)
  const handleViewClass = (classId) => {
    setActiveSection('classDetail');
  };
  

  const fetchClasses = async () => {
    try {
      const result = await getClassesByTeacherId(user.id);
      if (result.success) {
        setClasses(getUpcomingClasses(result.data)); // clases activas
        setAllClasses(sortClassesByDate(result.data)); // Activas e inactivas
        setActiveClass(getActiveClasses(result.data)); // clase del momento
        setNextClass(getNextClass(result.data)); // proxima clase
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchTeacher = async ()=>{
    try {
      const result = await getTeacherById(user.id);
      setTeacherRegis(result.data)
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }

  useEffect(() => {
    fetchClasses();
    fetchTeacher();
  }, [user.id]);

  const classesToApprove = classes.filter(classItem => !classItem.status);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="w-full sticky top-0 bg-gradient-to-r from-purple-600 to-purple-400 p-6 text-white shadow-md z-[9] ">
        <h1 className="text-3xl font-semibold text-center">Bienvenido al Dashboard del Profesor</h1>
      </div>
<ClassesHeader 
    teacher={teacherRegis}
    nextClass={nextClass}
    activeClass={activeClass}

/>
   <div className="flex-1 p-8 space-y-6">
         {/*  <div className="flex justify-center">
          <Link to="/whiteboard/:room">
            <Button className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
              Ir a la Pizarra
            </Button>
          </Link>
        </div> */}

    <UpcomingClasses classes={classes} />
        
        <ClassesToApprove classesToApprove={classesToApprove} setClasses={setClasses} />
    <AllClasses allClasses={allClasses} />
        <StudentLastMessages user={user} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
