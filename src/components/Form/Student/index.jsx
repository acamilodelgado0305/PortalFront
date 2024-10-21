// FormStudent.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { questions } from "./questionsData";

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
  const navigate = useNavigate();

  useEffect(() => {
    const savedAnswers = localStorage.getItem("studentPreferences");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studentPreferences", JSON.stringify(answers));
  }, [answers]);

  const handleOptionSelected = (option, suboption = null) => {
    const newAnswers = [...answers];

    if (suboption) {
      // Si se selecciona una subopción, marca como respuesta
      newAnswers[currentQuestionIndex] = suboption;
      setAnswers(newAnswers);
      setSelectedOption(suboption.text); // Marca la subopción como seleccionada
    } else {
      // Si se hace clic en la opción principal
      newAnswers[currentQuestionIndex] = option;
      setAnswers(newAnswers);
      localStorage.setItem("studentPreferences", JSON.stringify(newAnswers)); // Guarda en localStorage

      if (selectedOption === option.text) {
        setShowSuboptions(null); // Oculta subopciones si ya estaba seleccionada
        setSelectedOption(null);  // Limpiar la opción seleccionada
      } else {
        setShowSuboptions(option.suboptions); // Mostrar subopciones
        setSelectedOption(option.text); // Actualizar opción seleccionada
      }
    }
  };



  const OptionButton = ({ text, isSelected, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full rounded-lg p-4 text-left text-lg font-semibold hover:bg-purple-100 border ${isSelected ? 'border-purple-500 bg-purple-300' : 'border-gray-300'}`}
      >
        <span>{text}</span>
        {/* Aquí puedes agregar el SVG si lo necesitas */}
      </button>
    );
  };





  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowSuboptions(null); // Reset suboptions
    } else {
      finishForm();
    }
  };

  const finishForm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsFormComplete(true);
    }, 2000); // Simulate API call
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    return (
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-purple-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-purple-400">
      <LoadingModal isOpen={isLoading} />
      <button
        onClick={() => navigate(-1)}
        className="absolute left-20 top-20 bg-transparent text-5xl font-bold text-white"
      >
        ←
      </button>

      <div className="flex h-screen items-center justify-center">
        <div className="flex h-full w-1/2 items-center p-10 pl-20">
          <h1 className="text-7xl font-bold text-white">
            {questions[currentQuestionIndex].question}
          </h1>
        </div>

        <div className="flex h-[100vh] w-[50%] flex-col items-center justify-center bg-white p-10 shadow-lg">
          {renderProgressBar()}
          {questions[currentQuestionIndex].type === "slider" ? (
            <div className="w-full">
              <input
                type="range"
                min={questions[currentQuestionIndex].min}
                max={questions[currentQuestionIndex].max}
                step={questions[currentQuestionIndex].step}
                value={budget}
                onChange={handleBudgetChange}
                className="w-full"
              />
              <p className="mt-2 text-lg text-center">
                Presupuesto: {budget} {questions[currentQuestionIndex].unit}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <div key={idx}>
                  <OptionButton
                    text={option.text}
                    isSelected={selectedOption === option.text}
                    onClick={() => handleOptionSelected(option)}
                  />
                  {option.suboptions && showSuboptions === option.suboptions && (
                    <div className=" grid grid-cols-2 mt-2 pl-4">
                      {option.suboptions.map((suboption, subidx) => (
                        <button
                          key={subidx}
                          onClick={() => handleOptionSelected(option, suboption)}
                          className={`block w-full p-2 text-left text-sm font-normal hover:bg-purple-200 ${answers[currentQuestionIndex] && answers[currentQuestionIndex].text === suboption.text ? "bg-purple-300" : ""
                            }`}
                        >
                          {suboption.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            </div>
          )}
          <div className="mt-8 flex w-full justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`${currentQuestionIndex === 0 ? "opacity-50" : ""
                } bg-purple-500 px-4 py-2 text-white rounded-lg hover:bg-pruple-700`}
            >
              Atrás
            </button>
            <button
              onClick={handleContinue}
              className="bg-purple-500 px-4 py-2 text-white rounded-lg hover:bg-purple-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      {isFormComplete && (
        <div div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-75">
          <div className="p-6 w-[20em] bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="w-full text-2xl font-semibold text-gray-800 text-center">
              ¡Formulario completado!
            </h2>
            <Link
              to="/results"
              className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800"
            >
              Continuar
            </Link>
          </div>
        </div>

      )
      }
    </div >
  );
}

export default FormStudent;
