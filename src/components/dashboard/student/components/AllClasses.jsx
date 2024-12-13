import ClassCard from "./ClassCard";
import { Button, List, Tag } from 'antd';
import {  UserSearch } from 'lucide-react';

const AllClasses = ({ allClasses, showAllOldClasses, setShowAllOldClasses }) => {
  return (
    <div className={`rounded-lg bg-[#fff] p-6 shadow-lg ${allClasses?.length == 0 && 'h-[200px]'}`}>
      <h2 className="mb-4 text-xl font-semibold text-purple-600 ">Todas Tus Clases</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAllOldClasses
          ? allClasses
          : (allClasses || []).slice(0, 3)
        ).map((professor) => (
          <ClassCard key={professor.teacher.id} professor={professor} />
        ))}
         {allClasses?.length == 0 && <div className="gap-4"><div className="w-full">No has acordado una clase aún. ¡Contacta con un profesor en la sección de Result! </div><Button className="bg-purple-600 text-white  mt-2">Result <UserSearch/></Button></div>}
      </div>
      {allClasses && allClasses.length > 3 && (
        <button
          onClick={() => setShowAllOldClasses(!showAllOldClasses)}
          className="mt-4 text-purple-600 hover:underline"
        >
          {showAllOldClasses ? "Ver Menos" : "Ver Más"}
        </button>
      )}
    </div>
  );
};

export default AllClasses;
