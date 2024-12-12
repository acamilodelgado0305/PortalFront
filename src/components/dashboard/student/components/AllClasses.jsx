import ClassCard from "./ClassCard";

const AllClasses = ({ allClasses, showAllOldClasses, setShowAllOldClasses }) => {
  return (
    <div className="rounded-lg bg-[#f0f8ff7a] p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-[#74a5fa]">Todas Tus Clases</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAllOldClasses
          ? allClasses
          : (allClasses || []).slice(0, 3)
        ).map((professor) => (
          <ClassCard key={professor.teacher.id} professor={professor} />
        ))}
      </div>
      {allClasses && allClasses.length > 3 && (
        <button
          onClick={() => setShowAllOldClasses(!showAllOldClasses)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showAllOldClasses ? "Ver Menos" : "Ver Más"}
        </button>
      )}
    </div>
  );
};

export default AllClasses;
