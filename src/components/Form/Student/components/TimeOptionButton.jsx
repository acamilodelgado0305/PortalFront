import { Sun, Sunset, Moon, Calendar, Clock } from "lucide-react";

export const TimeOptionButton = ({ text, isSelected, onClick }) => {
    const getIcon = () => {
      switch (text) {
        case "Mañanas":
          return <Sun className="h-6 w-6 text-yellow-500" />;
        case "Tardes":
          return <Sunset className="h-6 w-6 text-orange-500" />;
        case "Noches":
          return <Moon className="h-6 w-6 text-blue-900" />;
        case "Fines de semana":
          return <Calendar className="h-6 w-6 text-purple-500" />;
        case "Horario flexible":
          return <Clock className="h-6 w-6 text-green-500" />;
        default:
          return null;
      }
    };
  
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left text-lg font-semibold ${
          !isSelected ? "hover:bg-purple-100" : ""
        } ${
          isSelected ? "border-purple-500 bg-purple-300" : "border-gray-300"
        }`}
      >
        <span className="flex items-center gap-3">
          {getIcon()}
          {text}
        </span>
      </button>
    );
  };