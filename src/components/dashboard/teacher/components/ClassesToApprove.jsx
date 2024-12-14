import { Button, List, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { updateClassById } from '../../../../services/class.services';
import { hasClassEnded, convertToLocalTime, getUpcomingClasses } from "../../../../helpers";

const ClassesToApprove = ({ classesToApprove, setClasses }) => {
  const classesToAprove = getUpcomingClasses(classesToApprove)
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
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">Clases por Aprobar</h2>
      {classesToAprove.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={classesToAprove}
          renderItem={(classItem) => (
            <List.Item
              key={classItem.id}
              actions={[
                <Button className="bg-purple-600 text-white" onClick={() => approveStudent(classItem.id)}>
                  Aprobar
                </Button>,
                <Link to={`/student/${classItem.student?.id}`} className="text-purple-500 hover:underline">
                  Ver detalles
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={classItem.student ? `${classItem.student.nombre} ${classItem.student.apellido}` : 'Estudiante desconocido'}
                description={`${convertToLocalTime(classItem.hours)}  ${classItem.date}`}
              />
              <Tag color={classItem.status ? 'green' : 'red'}>
                {classItem.status ? 'Aprobado' : 'Pendiente'}
              </Tag>
            </List.Item>
          )}
        />
      ) : (
        <p>No hay estudiantes por aprobar.</p>
      )}
    </div>
  );
};

export default ClassesToApprove;
