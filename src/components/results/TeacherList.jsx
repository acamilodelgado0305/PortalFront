
function TeacherList({ teachers, openModal }) {
    return (
      <ul className="space-y-4">
        {teachers.map(teacher => (
          <li key={teacher.id} className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
            <img
              src={teacher.profileImageUrl || '/api/placeholder/400/400'}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{teacher.firstName} {teacher.lastName}</h2>
                <p className="text-gray-600">Tarifa: <span className="font-semibold">${teacher.hourlyRate}</span></p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{teacher.description.headline}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => openModal(teacher)}
              >
                Ver Video
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  
  export default TeacherList;