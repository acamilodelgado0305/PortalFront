import { Link } from "react-router-dom";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";

const ClassCard = ({ professor }) => {
  const { firstName, subjectYouTeach } = professor.teacher;
  const { date, hours, status } = professor;

  return (
    <div className="shadow-md bg-[#fff] transition-all hover:shadow-lg">
      <div className="flex flex-col p-4">
        <span className="text-lg font-semibold">{firstName}</span>
        <span className="text-purple-600">{subjectYouTeach}</span>
        <span className="text-gray-600">{date} {'  '} {convertToLocalTime(hours)}</span>
        <span className="text-gray-600">
          {!hasClassEnded(professor) && (status ? (
            <div className="flex items-center gap-1 font-medium text-green-600">
              Aceptado por el profesor <FcApproval className="text-lg" />
            </div>
          ) : (
            <div className="flex items-center gap-1 font-medium text-[#673ab7]">
              Pendiente de aprobación <FcBusinessContact className="text-lg" />
            </div>
          ))}
          {hasClassEnded(professor) && !status && (
            <div className="flex items-center gap-1 font-medium text-[#D50000]">
              Finalizada sin atender <FcCancel className="text-lg" />
            </div>
          )}
          {hasClassEnded(professor) && status && (
            <div className="flex items-center gap-1 font-medium text-[#D50000]">
              Clase finalizada <FcRating className="text-lg" />
            </div>
          )}
        </span>
        <Link
          to={`/profesor/${professor.id}`}
          className="mt-2 text-purple-600 hover:underline"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
