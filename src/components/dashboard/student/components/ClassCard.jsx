import { Card } from "@mui/material";
import { Link } from "react-router-dom";
import { FcApproval, FcBusinessContact, FcCancel, FcRating } from "react-icons/fc";
import { hasClassEnded, convertToLocalTime } from "../../../../helpers";

const ClassCard = ({ professor }) => {
  const { firstName, subjectYouTeach } = professor.teacher;
  const { date, hours, status } = professor;

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <div className="flex flex-col p-4">
        <span className="text-lg font-semibold">{firstName}</span>
        <span className="text-gray-600">{subjectYouTeach}</span>
        <span className="text-gray-600">{date} {convertToLocalTime(hours)}</span>
        <span className="text-gray-600">
          {!hasClassEnded(professor) && (status ? (
            <div className="flex items-center gap-1 font-medium text-green-600">
              Accepted by Professor <FcApproval className="text-lg" />
            </div>
          ) : (
            <div className="flex items-center gap-1 font-medium text-[#673ab7]">
              Pending Approval <FcBusinessContact className="text-lg" />
            </div>
          ))}
          {hasClassEnded(professor) && !status && (
            <div className="flex items-center gap-1 font-medium text-[#D50000]">
              Ended Unattended <FcCancel className="text-lg" />
            </div>
          )}
          {hasClassEnded(professor) && status && (
            <div className="flex items-center gap-1 font-medium text-[#D50000]">
              Class Finished <FcRating className="text-lg" />
            </div>
          )}
        </span>
        <Link
          to={`/profesor/${professor.id}`}
          className="mt-2 text-blue-500 hover:underline"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default ClassCard;
