import ClassCard from "./ClassCard";

const UpcomingClasses = ({ classes, showAll, setShowAll }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-[#74a5fa]">Upcoming Activities</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAll ? classes : classes.slice(0, 3)).map((professor) => (
          <ClassCard key={professor.teacher.id} professor={professor} />
        ))}
      </div>
      {classes.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showAll ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

export default UpcomingClasses;
