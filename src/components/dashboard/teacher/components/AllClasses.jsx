import { useState } from "react";

import ClassCard from "./ClassCard";

const AllClasses = ({ allClasses, onClassClick }) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-purple-600">
        Todas tus Clases
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAll ? allClasses : allClasses.slice(0, 3)).map((classItem) => (
          <ClassCard key={classItem.id} classItem={classItem} />
        ))}
      </div>
      {allClasses.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-purple-600 hover:underline"
        >
          {allClasses?.length > 3 && (showAll ? "Ver Menos" : "Ver Más")}
        </button>
      )}
    </div>
  );
};

export default AllClasses;
