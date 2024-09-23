import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { svgProfessional, svgSmile, svgExams, svgBriefcase, svgFlagUsa, svgFlagSpain, svgFlagCanada, svgFlagUK, svgDominicanRepublic, svgMoonZzz, svgMoonCloud, svgMoon, svgSun, svgSunFog } from "./icons"
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
    type: "hours",
    options: [
      {
        label: "Horas",
        sections: [
          {
            label: "Día",
            values: [
              { label: "9-12", value: "9-12", svg: svgSunFog },
              { label: "12-15", value: "12-15", svg: svgSun },
              { label: "15-18", value: "15-18", svg: svgSun },
            ],
          },
          {
            label: "Tarde y noche",
            values: [
              { label: "18-21", value: "18-21", svg: svgSunFog },
              { label: "21-24", value: "21-24", svg: svgMoonCloud },
              { label: "0-3", value: "0-3", svg: svgMoon },
            ],
          },
          {
            label: "Madrugada",
            values: [
              { label: "3-6", value: "3-6", svg: svgMoonZzz },
              { label: "6-9", value: "6-9", svg: svgSunFog },
            ],
          },
        ],
      },
      {
        type: "days",
        label: "Días",
        values: ["Dom", "Lun", "Mar", "Miér", "Jue", "Vie", "Sáb"],
      },
    ],
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
  const [answers, setAnswers] = useState(questions.map(() => null));
  const [budget, setBudget] = useState([1, 40]);

  const handleOptionSelected = (optionText) => {
    const newAnswers = [...answers];

    if (currentQuestionIndex === 2 || currentQuestionIndex === 3) {
      if (!Array.isArray(newAnswers[currentQuestionIndex])) {
        newAnswers[currentQuestionIndex] = [];
      }
      const currentAnswer = newAnswers[currentQuestionIndex];

      if (currentAnswer.includes(optionText)) {
        newAnswers[currentQuestionIndex] = currentAnswer.filter(text => text !== optionText);
      } else {
        newAnswers[currentQuestionIndex].push(optionText);
      }
    } else {
      if (newAnswers[currentQuestionIndex] === optionText) {
        newAnswers[currentQuestionIndex] = null;
      } else {
        newAnswers[currentQuestionIndex] = optionText;
      }
    }

    setAnswers(newAnswers);
  };

  const handleRangeChange = (values) => {
    setBudget(values);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = values;
    setAnswers(newAnswers);
  };

  const handleHoursSelected = (sectionLabel, value) => {
    let newAnswers = Array.isArray(answers) ? [...answers] : [];
    if (typeof newAnswers[currentQuestionIndex] !== 'object' || newAnswers[currentQuestionIndex] === null) {
      newAnswers[currentQuestionIndex] = {};
    }
    const currentAnswer = { ...newAnswers[currentQuestionIndex] };
    if (!currentAnswer.hours) {
      currentAnswer.hours = {};
    }
    if (!Array.isArray(currentAnswer.hours[sectionLabel])) {
      currentAnswer.hours[sectionLabel] = [];
    }
    if (currentAnswer.hours[sectionLabel].includes(value)) {
      currentAnswer.hours[sectionLabel] = currentAnswer.hours[sectionLabel].filter(val => val !== value);
    } else {
      currentAnswer.hours[sectionLabel].push(value);
    }
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);
  };
  
  const handleDaysSelected = (day) => {
    let newAnswers = Array.isArray(answers) ? [...answers] : [];
    if (typeof newAnswers[currentQuestionIndex] !== 'object' || newAnswers[currentQuestionIndex] === null) {
      newAnswers[currentQuestionIndex] = {};
    }
    const currentAnswer = { ...newAnswers[currentQuestionIndex] };
    if (!Array.isArray(currentAnswer.days)) {
      currentAnswer.days = [];
    }
    if (currentAnswer.days.includes(day)) {
      currentAnswer.days = currentAnswer.days.filter(val => val !== day);
    } else {
      currentAnswer.days.push(day);
    }
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Final answers: ", answers);
    }
  };

  useEffect(() => {
    console.log(answers, "answers");
  }, [answers]);

  const isAnswered = currentQuestionIndex === 2 || currentQuestionIndex === 3
    ? answers[currentQuestionIndex]?.length > 0
    : answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] !== null;
  
  const isSkippable = currentQuestionIndex >= 2 && currentQuestionIndex <= 5;

  return (
    <div className="min-h-screen flex flex-col justify-center bg-pink-400">
      <button 
        onClick={handleBack}
        className="absolute top-20 left-20 bg-transparent text-black font-bold text-5xl">
        ←
      </button>

      <div className="flex justify-center items-center h-screen"> 
        <div className="w-1/2 p-10 h-full flex items-center pl-20">
          <h1 className="text-black text-7xl font-bold">
            {questions[currentQuestionIndex].question}
          </h1>
      </div>      

        <div className="w-1/2 bg-white p-10 shadow-lg h-full flex flex-col justify-center ">
          <div className="flex-grow space-y-6 flex-col items-center mt-96 mx-6 ">
            {questions[currentQuestionIndex].type === "range" ? (
              <div className="flex flex-col items-center mt-40">
                <div className="text-4xl font-bold mb-16">
                  {`${questions[currentQuestionIndex].unit}${budget[0]} - ${questions[currentQuestionIndex].unit}${budget[1]}${budget[1] === 40 ? '+' : ''}`}
                </div>
                  <Range
                    step={questions[currentQuestionIndex].step}
                    min={questions[currentQuestionIndex].min}
                    max={questions[currentQuestionIndex].max}
                    values={budget}
                    onChange={handleRangeChange}
                    renderTrack={({ props, children }) => {
                      const { key, ...restProps } = props;
                        return (
                          <div
                          key={key}
                          {...restProps}
                          style={{
                            height: '6px',
                            width: '100%',
                            background: '#000',                 
                            position: 'relative',
                          }}
                        >
                          {children}
                        </div>
                      );
                    }}
                      renderThumb={({ props }) => {
                        const { key, ...restProps } = props;
                        return (
                          <div
                            key={key}
                            {...restProps}
                            style={{
                              height: '60px',
                              width: '60px',
                              backgroundColor: 'white',
                              border: "4px solid black",
                              borderRadius: '20%',
                              position: 'absolute',
                            }}
                          />
                        );        
                      }}
                    />
                  </div>
              ) : questions[currentQuestionIndex].type === "hours" ? (
                  <div>
                    <h2 className="text-4xl font-bold mb-4 -mt-32">Horas</h2>
                    {questions[currentQuestionIndex].options.find(opt => opt.label === "Horas").sections.map((section, idx) => (
                      <div key={idx} className="mb-6 ">
                        <h3 className="text-xl font-semibold mb-2 ">{section.label}</h3>
                        <div className="grid grid-cols-3 gap-4 ">
                          {section.values.map(value => (
                            <div
                              key={value.value}
                              onClick={() => handleHoursSelected(section.label, value.value)} // dia, 9-12
                              className={`p-4 border-4 rounded-lg cursor-pointer font-bold text-xl flex flex-col items-center ${
                                answers[currentQuestionIndex]?.hours?.[section.label]?.includes(value.value) ? 'bg-pink-400 border-black' : 'border-gray-300'
                              }`}
                            >
                              {value.svg}
                              {value.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <h2 className="text-3xl font-bold mb-4 ">Días</h2>
                    <div className="grid grid-cols-7 gap-4 ">
                      {questions[currentQuestionIndex].options.find(opt => opt.label === "Días").values.map((day, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleDaysSelected(day)}
                          className={`p-4 border-4 rounded-lg cursor-pointer font-bold text-2xl flex justify-center ${
                            answers[currentQuestionIndex]?.days?.includes(day) ? 'bg-pink-400 border-black' : 'border-gray-300'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
              ) : (
              questions[currentQuestionIndex].options?.map((option, index) => (
                <div key={index} className="flex justify-between text-2xl font-semibold border-4 border-gray-300 rounded-xl p-6 items-center w-full">
                  <div className="flex items-center space-x-2">
                    <div>{option.svg}</div>
                    <label htmlFor={`option-${index}`} className="block text-gray-700 w-full">{option.text}</label>
                  </div>
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    name="option"
                    checked={currentQuestionIndex === 2 || currentQuestionIndex === 3
                      ? answers[currentQuestionIndex]?.includes(option.text)
                      : answers[currentQuestionIndex] === option.text || false}
                    onChange={() => handleOptionSelected(option.text)}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-400"
                  />
                </div>
              )))}        
            </div>  
          
          <div className="mt-auto">
          <button
            onClick={handleContinue}
            disabled={!isAnswered && !isSkippable}
            className={`w-full text-black text-2xl font-bold py-4 px-4 rounded-lg shadow mb-6 ${
              isAnswered 
                ? 'bg-pink-400 hover:bg-pink-600 border border-black'
                : isSkippable 
                  ? 'bg-white border border-black hover:bg-gray-200'
                  : 'bg-white border border-black cursor-not-allowed'
            }`}
          >
            {isAnswered ? (currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Continuar") 
              : isSkippable 
                ? "Saltar esta pregunta" 
                : "Continuar"}
          </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Form;