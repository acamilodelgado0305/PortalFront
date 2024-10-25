import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Sun, Sunset, Moon, Calendar, Clock } from "lucide-react";
import {
  questions,
  questionsEnglish,
  questionLanguajes,
  questionOther,
} from "./questionsData";

const TimeOptionButton = ({ text, isSelected, onClick }) => {
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
      className={`flex w-full items-center justify-between rounded-lg border p-4 text-left text-lg font-semibold hover:bg-purple-100 ${
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

function LoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="flex flex-col items-center rounded-lg bg-white p-5">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        <p className="mt-4 text-lg font-semibold text-purple-600">
          Cargando...
        </p>
      </div>
    </div>
  );
}

function FormStudent() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [budget, setBudget] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showSuboptions, setShowSuboptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSuboption, setSelectedSuboption] = useState(null);
  const [handleOtherValue, setHandleOtherValue] = useState(null);
  const navigate = useNavigate();
  const [currentQuestions, setCurrentQuestions] = useState(questions);
  const [isInputVisible, setIsInputVisible] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("studentPreferences");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studentPreferences", JSON.stringify(answers));
  }, [answers]);

  const handleOptionSelected = (option) => {
    if (handleOtherValue && currentQuestionIndex == 0) {
      setSelectedOption(handleOtherValue);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = `${handleOtherValue}`;
      setAnswers(newAnswers);
      setCurrentQuestions(questionOther);
      return;
    } else {
      setSelectedOption(option);
      setShowSuboptions(option.suboptions);
      if (!option.suboptions) {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = `${option.text}`;
        setAnswers(newAnswers);
      }
    }
  };

  const handleOptionList = (optionName, suboptions) => {
    if (optionName == "Idiomas" && suboptions == "Inglés") {
      setCurrentQuestions(questionsEnglish);
    } else if (optionName == "Idiomas") {
      setCurrentQuestions(questionLanguajes);
    } else {
      setCurrentQuestions(questionOther);
    }
  };

  const handleSuboptionSelected = (suboption) => {
    setSelectedSuboption(suboption);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = `${selectedOption.text}+${suboption.text}`;
    setAnswers(newAnswers);
    if ((selectedOption.text, suboption.text)) {
      handleOptionList(selectedOption.text, suboption.text);
    }
  };

  const handleShowAllOptions = () => {
    setShowSuboptions(null);
    setSelectedOption(null);
    setSelectedSuboption(null);
  };

  const handleContinue = () => {
    if (currentQuestionIndex == 1) setShowSuboptions(false);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleShowAllOptions();
    } else {
      finishForm();
    }
  };

  const finishForm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsFormComplete(true);
      localStorage.setItem("studentPreferences", JSON.stringify(answers));
    }, 2000);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      handleShowAllOptions();
    }
  };

  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    setBudget(value);

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const renderProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    return (
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-purple-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const renderQuestionContent = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion.type === "slider") {
      return (
        <div className="w-full">
          <input
            type="range"
            min={currentQuestion.min}
            max={currentQuestion.max}
            step={currentQuestion.step}
            value={budget}
            onChange={handleBudgetChange}
            className="h-4 mt-6 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 custom-range"
          />
          <div className="mt-4 text-center text-xl font-semibold">
            {budget} {currentQuestion.unit}
          </div>
        </div>
      );
    }

    const isTimeQuestion = currentQuestion.question.includes("¿Cuándo te vienen bien las clases?");

    return (
      <div className="w-full">
        {showSuboptions ? (
          <>
            <div className="mb-4 flex items-center">
              <button onClick={handleShowAllOptions} className="mr-2 text-3xl">
                ←
              </button>
              <h2 className="text-2xl font-bold">
                Subopciones de {selectedOption.text}
              </h2>
            </div>
            <div className="max-h-[45em] overflow-y-auto">
              {showSuboptions.map((suboption, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuboptionSelected(suboption)}
                  className={`block w-full p-2 text-left text-lg font-normal hover:bg-purple-200 ${
                    selectedSuboption === suboption ? "bg-purple-300" : ""
                  }`}
                >
                  {suboption.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="mb-4">
                {isTimeQuestion ? (
                  <TimeOptionButton
                    text={option.text}
                    isSelected={selectedOption === option}
                    onClick={() => handleOptionSelected(option)}
                  />
                ) : (
                  <button
                    onClick={() => handleOptionSelected(option)}
                    className={`flex w-full items-center justify-between rounded-lg border p-4 text-left text-lg font-semibold hover:bg-purple-100 ${
                      selectedOption === option
                        ? "border-purple-500 bg-purple-300"
                        : "border-gray-300"
                    }`}
                  >
                    <span>{option.text}</span>
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white-400 flex min-h-screen flex-col justify-center">
      <LoadingModal isOpen={isLoading} />
      <button
        onClick={() => navigate(-1)}
        className="text-purple absolute left-20 top-20 bg-transparent text-5xl font-bold"
      >
        ←
      </button>

      <div className="flex h-screen items-center justify-center">
        <div className="flex h-full w-1/2 items-center p-10 pl-20">
          <h1 className="text-7xl font-bold text-black">
            {currentQuestions[currentQuestionIndex].question}
          </h1>
        </div>

        <div className="flex h-[100vh] w-[50%] flex-col items-center justify-center bg-white p-10 shadow-lg">
          {renderProgressBar()}
          {renderQuestionContent()}

          <div className="mt-8 flex w-full justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`${
                currentQuestionIndex === 0 ? "opacity-50" : ""
              } rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-700`}
            >
              Atrás
            </button>
            <button
              onClick={handleContinue}
              className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      {isFormComplete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-75">
          <div className="flex w-[20em] flex-col items-center rounded-lg bg-white p-6 shadow-lg">
            <h2 className="w-full text-center text-2xl font-semibold text-gray-800">
              ¡Formulario completado!
            </h2>
            <Link
              to="/results"
              className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-800"
            >
              Continuar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormStudent;