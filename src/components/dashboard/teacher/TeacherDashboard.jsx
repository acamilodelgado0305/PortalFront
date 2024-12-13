import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { getClassesByTeacherId, updateClassById } from "../../../services/class.services.js";
import { useAuth } from '../../../Context/AuthContext.jsx';
import StudentLastMessages from './components/StudentLastMessages.jsx';
import ClasesHeader from './components/ClasesHeader.jsx'; 
import StudentsToApprove from './components/StudentsToApprove.jsx'; 

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('teachers');
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);

  const handleViewClass = (classId) => {
    setActiveSection('classDetail');
  };

  const approveStudent = async (classId) => {
    try {
      const data = { status: true };
      const result = await updateClassById(classId, data);
      if (result.success) {
        setClasses(prevClasses =>
          prevClasses.map(item =>
            item.id === classId ? { ...item, status: true } : item
          )
        );
      }
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const result = await getClassesByTeacherId(user.id);
      if (result.success) {
        setClasses(result.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user.id]);

  const studentsToApprove = classes.filter(classItem => !classItem.status);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="w-full sticky top-0 bg-gradient-to-r from-purple-600 to-purple-400 p-6 text-white shadow-md">
        <h1 className="text-3xl font-semibold text-center">Bienvenido al Dashboard del Profesor</h1>
      </div>

      <div className="flex-1 p-8 space-y-6">
        <div className="flex justify-center">
          <Link to="/whiteboard/:room">
            <Button className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
              Ir a la Pizarra
            </Button>
          </Link>
        </div>

        <ClasesHeader classes={classes} />
        
        <StudentsToApprove studentsToApprove={studentsToApprove} approveStudent={approveStudent} />

        <StudentLastMessages user={user} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
