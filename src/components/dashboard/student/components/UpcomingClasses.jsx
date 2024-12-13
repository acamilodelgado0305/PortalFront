import { useState } from "react";
import ClassCard from "./ClassCard";

const UpcomingClasses = ({ classes}) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className={`rounded-lg bg-[#fff] p-6 shadow-lg ${classes?.length == 0 && 'h-[200px]'}`}>
      <h2 className="mb-4 text-xl font-semibold text-purple-600">Actividades Próximas</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAll ? classes : classes.slice(0, 3)).map((professor) => (
          <ClassCard key={professor.teacher.id} professor={professor} />
        ))}
        {classes?.length == 0 && <div className="w-[1500px]">No tiene proximas clases en este momento.</div>}
      </div>
      {classes.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-purple-600 hover:underline"
        >
          {showAll ? "Ver Menos" : "Ver Más"}
        </button>
      )}
    </div>
  );
};

export default UpcomingClasses;
