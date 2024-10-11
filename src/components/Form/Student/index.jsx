import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  svgProfessional,
  svgSmile,
  svgExams,
  svgBriefcase,
  svgFlagUsa,
  svgFlagSpain,
  svgFlagCanada,
  svgFlagUK,
  svgDominicanRepublic,
} from "./icons";
import { useNavigate } from 'react-router-dom';


const questions = [
  {
    id: 1,
    question: "¿Cuál es tu objetivo?",
    options: [
      { text: "Carrera profesional y negocios", svg: svgProfessional },
      { text: "Clases para niños", svg: svgSmile },
      { text: "Examenes y cursos", svg: svgExams },
      { text: "Cultura, pasatiempos o para viajar", svg: svgBriefcase },
    ],
  },
  {
    id: 2,
    question: "¿Cuál es tu nivel de inglés?",
    options: [
      { text: "Soy principiante" },
      { text: "Conozco lo básico" },
      { text: "Puedo conversar" },
      { text: "Me desenvuelvo con soltura en la mayoría de las conversaciones" },
    ],
  },
  {
    id: 3,
    question: "¿Buscas un acento o cultura concretos?",
    options: [
      { text: "Canada", svg: svgFlagCanada },
      { text: "España", svg: svgFlagSpain },
      { text: "Estados Unidos", svg: svgFlagUsa },
      { text: "Reino Unido", svg: svgFlagUK },
      { text: "República Dominicana", svg: svgDominicanRepublic },
    ],
  },
  {
    id: 4,
    question: "¿Algún interés en concreto?",
    options: [
      { text: "Inglés estadounidense" },
      { text: "Inglés de negocios" },
      { text: "Inglés conversacional" },
      { text: "BEC" },
      { text: "Inglés para niños" },
    ],
  },
  {
    id: 5,
    question: "¿Cuándo te vienen bien las clases?",
    options: [
      { text: "Mañanas" },
      { text: "Tardes" },
      { text: "Noches" },
      { text: "Fines de semana" },
      { text: "Horario flexible" },
    ],
  },
  {
    id: 6,
    question: "¿Cuál es tu presupuesto para una clase?",
    type: "slider",
    min: 1,
    max: 40,
    step: 1,
    unit: "US$",
  },
];

function LoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-lg font-semibold text-purple-600">Cargando...</p>
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
  const navigate = useNavigate();

  useEffect(() => {
    const savedAnswers = localStorage.getItem('studentPreferences');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studentPreferences', JSON.stringify(answers));
  }, [answers]);

  const handleOptionSelected = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishForm();
    }
  };

  const finishForm = () => {
    setIsLoading(true);
    // Simulate an API call or processing time
    setTimeout(() => {
      setIsLoading(false);
      setIsFormComplete(true);
    }, 2000); // Adjust the timeout as needed
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
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <LoadingModal isOpen={isLoading} />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 left-20 bg-transparent text-white font-bold text-5xl"
      >
        ←
      </button>
      <button
        onClick={handleContinue}
        className="absolute top-20 right-20 bg-transparent text-white font-bold text-2xl"
      >
        Saltar
      </button>

      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 p-10 h-full flex items-center pl-20">
          <h1 className="text-white text-7xl font-bold">
            {questions[currentQuestionIndex].question}
          </h1>
        </div>

        <div className="w-1/2 bg-white p-10 shadow-lg h-full flex flex-col justify-center rounded-l-3xl">
          {renderProgressBar()}
          <div className="flex-grow space-y-6 flex-col items-center mt-[10em] mx-6 ">
            {questions[currentQuestionIndex].type === "slider" ? (
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min={questions[currentQuestionIndex].min}
                  max={questions[currentQuestionIndex].max}
                  step={questions[currentQuestionIndex].step}
                  value={budget}
                  onChange={handleBudgetChange}
                  className="w-full mt-8 accent-purple-600"
                />
                <div className="text-2xl font-bold mt-4">{`${questions[currentQuestionIndex].unit
                  }${budget} - ${budget === 40
                    ? `${questions[currentQuestionIndex].unit}40+`
                    : ""
                  }`}</div>
              </div>
            ) : (
              questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelected(option.text)}
                  className={`flex justify-between text-2xl font-semibold border-4 rounded-xl p-6 items-center w-full cursor-pointer transition-all duration-300 ${answers[currentQuestionIndex] === option.text
                      ? "bg-purple-200 border-purple-400 shadow-md transform scale-105"
                      : "border-gray-300 hover:bg-purple-100 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <div>{option.svg}</div>
                    <span className="block text-gray-700 w-full">
                      {option.text}
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      className={`w-6 h-6 border-2 rounded-full ${answers[currentQuestionIndex] === option.text
                          ? "border-purple-400"
                          : "border-gray-400"
                        }`}
                    >
                      {answers[currentQuestionIndex] === option.text && (
                        <div className="absolute inset-0 m-1 rounded-full bg-purple-400"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto">
            {isFormComplete ? (
              <Link
                to="/results"
                className="block w-full text-center text-white text-2xl font-bold py-4 px-4 rounded-lg shadow mb-6 bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Encontrar Tutor
              </Link>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!answers[currentQuestionIndex]}
                className={`w-full text-white text-2xl font-bold py-4 px-4 rounded-lg shadow mb-6 transition-all duration-300 ${answers[currentQuestionIndex]
                    ? "bg-purple-600 hover:bg-purple-700 transform hover:scale-105"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Continuar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormStudent;