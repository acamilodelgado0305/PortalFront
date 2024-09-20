import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { svgProfessional, svgSmile, svgExams, svgBriefcase, svgFlagUsa, svgFlagSpain, svgFlagCanada, svgFlagUK, svgDominicanRepublic } from "./icons"
import { Range } from 'react-range';

const questions = [
  {
    id: 1,
    question: "¿Cuál es tu objetivo?",
    options: [
      { text: "Carrera profesional y negocios", svg: svgProfessional },
      { text: "Clases para niños", svg: svgSmile },
      { text: "Examenes y cursos", svg: svgExams },
      { text: "Cultura, pasatiempos o para viajar", svg: svgBriefcase } 
    ]
  },
  { 
    id: 2,
    question: "¿Cuál es tu nivel de inglés?",
    options: [
      { text: "Soy principiante"},
      { text: "Conozco lo básico"},
      { text: "Puedo conversar"},
      { text: "Me desenvuelvo con soltura en la mayoría de las conversaciones"}
    ]
  },
  { 
    id: 3,
    question: "¿Buscas un acento o cultura concretos?",
    options: [
      { text: "Canada", svg: svgFlagCanada },
      { text: "España", svg: svgFlagSpain },
      { text: "Estados Unidos", svg: svgFlagUsa },
      { text: "Reino Unido", svg: svgFlagUK },
      { text: "República Dominicana", svg: svgDominicanRepublic}
    ]
  },
  { 
    id: 4,
    question: "¿Algún interés en concreto?",
    options: [
      { text: "Inglés estadounidense"},
      { text: "Inglés de negocios"},
      { text: "Inglés conversacional"},
      { text: "BEC"},
      { text: "Inglés para niños"}
    ]
  },
  { 
    id: 5,
    question: "¿Cuándo te vienen bien las clases?",
    options: [
      { text: "Inglés estadounidense"},
      { text: "Inglés de negocios"},
      { text: "Inglés conversacional"},
      { text: "BEC"},
      { text: "Inglés para niños"}
    ]
  },
  {
    id: 6,
    question: "¿Cuál es tu presupuesto para una clase?",
    type: "range",
    min: 1,
    max: 40,
    step: 1,
    unit: "US$",
  }
];

function Form() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [budget, setBudget] = useState([1, 40]);

  const handleOptionSelected = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Final answers: ", answers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRangeChange = (values) => {
    setBudget(values);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = values;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-pink-400">
      <button 
        onClick={handleBack}
        className="absolute top-20 left-20 bg-transparent text-black font-bold text-5xl">
        ←
      </button>
      <button
        onClick={handleContinue}
        className="absolute top-20 right-20 bg-transparent text-black font-bold text-2xl">
        Saltar
      </button>

      <div className="flex justify-center items-center h-screen"> 
        <div className="w-1/2 p-10 h-full flex items-center pl-20">
          <h1 className="text-black text-7xl font-bold">
            {questions[currentQuestionIndex].question}
          </h1>
        </div>

        <div className="w-1/2 bg-white p-10 shadow-lg h-full flex flex-col justify-center">
          <div className="flex-grow space-y-6 flex-col items-center mt-96 mx-6 ">
            {questions[currentQuestionIndex].type === "range" ? (
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-16">
                  {`${questions[currentQuestionIndex].unit}${budget[0]} - ${questions[currentQuestionIndex].unit}${budget[1]}${budget[1] === 40 ? '+' : ''}`}
                </div>
                <Range
                  step={questions[currentQuestionIndex].step}
                  min={questions[currentQuestionIndex].min}
                  max={questions[currentQuestionIndex].max}
                  values={budget}
                  onChange={handleRangeChange}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        height: '6px',
                        width: '100%',
                        background: '#000',
                        position: 'relative',
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props}) => (
                    <div
                      {...props}
                      style={{
                        height: '60px',
                        width: '60px',
                        backgroundColor: 'white',
                        border: "4px solid black",
                        borderRadius: '20%',
                        position: 'absolute',
                      }}
                    >
                    </div>
                  )}
                />

                
              </div>
            ) : (
              questions[currentQuestionIndex].options?.map((option, index) => (
                <div key={index} className="flex justify-between text-2xl font-semibold border-4 border-gray-300 rounded-xl p-6 items-center w-full">
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`option-${index}`} className="block text-gray-700 w-full">{option.text}</label>
                  </div>
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="option"
                    value={option.text}
                    onClick={() => handleOptionSelected(option.text)}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-400 "
                  />
                </div>
              ))
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={handleContinue}
              disabled={!answers[currentQuestionIndex]}  
              className={`w-full text-black text-2xl font-bold py-4 px-4 rounded-lg shadow mb-6 ${
                answers[currentQuestionIndex] ? 'bg-pink-400 hover:bg-pink-600 border-black' : 'bg-gray-400 border-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;