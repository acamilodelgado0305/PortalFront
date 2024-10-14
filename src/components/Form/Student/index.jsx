import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  svgFlagUsa,
  svgFlagSpain,
  svgFlagCanada,
  svgFlagUK,
  svgDominicanRepublic,
} from "./icons";
import { useNavigate } from "react-router-dom";
import {
  BookOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  SignatureOutlined  
} from "@ant-design/icons";

const questions = [
  {
    id: 1,
    question: "¿Qué quieres aprender?",
    options: [
      { text: "Lenguajes", svg: (<BookOutlined />) },
      { text: "Matemática", svg: (<CalculatorOutlined />) },
      { text: "Ciencia", svg: (<ExperimentOutlined />) },
      { text: "Arte", svg: (<SignatureOutlined />) },
    ],
  },
  {
    id: 2,
    question: "¿Cuál es tu nivel de inglés?",
    options: [
      { text: "Soy principiante" },
      { text: "Conozco lo básico" },
      { text: "Puedo conversar" },
      {
        text: "Me desenvuelvo con soltura en la mayoría de las conversaciones",
      },
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
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-purple-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <LoadingModal isOpen={isLoading} />
      <button
        onClick={() => navigate(-1)}
        className="absolute left-20 top-20 bg-transparent text-5xl font-bold text-white"
      >
        ←
      </button>
      <button
        onClick={handleContinue}
        className="absolute right-20 top-20 bg-transparent text-2xl font-bold text-white"
      >
        Saltar
      </button>

      <div className="flex h-screen items-center justify-center">
        <div className="flex h-full w-1/2 items-center p-10 pl-20">
          <h1 className="text-7xl font-bold text-white">
            {questions[currentQuestionIndex].question}
          </h1>
        </div>

        <div className="flex h-full w-1/2 flex-col justify-center rounded-l-3xl bg-white p-10 shadow-lg">
          {renderProgressBar()}
          <div className="mx-6 mt-[10em] flex-grow flex-col items-center space-y-6">
            {questions[currentQuestionIndex].type === "slider" ? (
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min={questions[currentQuestionIndex].min}
                  max={questions[currentQuestionIndex].max}
                  step={questions[currentQuestionIndex].step}
                  value={budget}
                  onChange={handleBudgetChange}
                  className="mt-8 w-full accent-purple-600"
                />
                <div className="mt-4 text-2xl font-bold">{`${
                  questions[currentQuestionIndex].unit
                }${budget} - ${
                  budget === 40
                    ? `${questions[currentQuestionIndex].unit}40+`
                    : ""
                }`}</div>
              </div>
            ) : (
              questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelected(option.text)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl border-4 p-6 text-2xl font-semibold transition-all duration-300 ${
                    answers[currentQuestionIndex] === option.text
                      ? "scale-105 transform border-purple-400 bg-purple-200 shadow-md"
                      : "border-gray-300 hover:bg-purple-100 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div>{option.svg}</div>
                    <span className="block w-full text-gray-700">
                      {option.text}
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      className={`h-6 w-6 rounded-full border-2 ${
                        answers[currentQuestionIndex] === option.text
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
                className="mb-6 block w-full transform rounded-lg bg-purple-600 px-4 py-4 text-center text-2xl font-bold text-white shadow transition-all duration-300 hover:scale-105 hover:bg-purple-700"
              >
                Encontrar Tutor
              </Link>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!answers[currentQuestionIndex]}
                className={`mb-6 w-full rounded-lg px-4 py-4 text-2xl font-bold text-white shadow transition-all duration-300 ${
                  answers[currentQuestionIndex]
                    ? "transform bg-purple-600 hover:scale-105 hover:bg-purple-700"
                    : "cursor-not-allowed bg-gray-400"
                }`}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finalizar"
                  : "Continuar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormStudent;
