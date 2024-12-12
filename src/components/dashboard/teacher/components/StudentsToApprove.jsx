import { Button, List, Tag } from 'antd';
import { Link } from 'react-router-dom';

const StudentsToApprove = ({ studentsToApprove, approveStudent }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">Estudiantes por Aprobar</h2>
      {studentsToApprove.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={studentsToApprove}
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
                description={`Estado: ${classItem.status ? 'Aprobado' : 'Pendiente'}`}
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

export default StudentsToApprove;
